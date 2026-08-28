import { loginUserUsecase } from "./login-user.usecase.js";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { User } from "../../domain/entities/user.entity.js";
import { hashPassword } from "../../infrastructure/security/password.util.js";
import { generateSecret, generate } from "otplib";

describe("loginUserUsecase", () => {
  const createFakeRepository = (userToFind: User | null): IUserRepository => ({
    findAll: async () => [],
    findById: async () => null,
    findByEmail: async () => userToFind,
    create: async (data) => ({
      id: "1",
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: async (id, data) => ({ ...(userToFind as User), ...data }),
  });

  it("should return user and token with correct credentials", async () => {
    const hashedPassword = await hashPassword("Passw0rd!");
    const existingUser: User = {
      id: "1",
      email: "test@example.com",
      password: hashedPassword,
      firstName: "Jean",
      lastName: "Dupont",
      phone: null,
      role: "CLIENT",
      otp_enable: false,
      otp_secret: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fakeRepository = createFakeRepository(existingUser);
    const loginUser = loginUserUsecase(fakeRepository);

    const result = await loginUser({
      email: "test@example.com",
      password: "Passw0rd!",
    });

    expect(result.user.email).toBe("test@example.com");
    expect(result.user).not.toHaveProperty("password");
    expect(result.token).toBeDefined();
  });

  it("should throw 401 when email does not exist", async () => {
    const fakeRepository = createFakeRepository(null);
    const loginUser = loginUserUsecase(fakeRepository);

    await expect(
      loginUser({ email: "unknown@example.com", password: "Passw0rd!" }),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid credentials",
    });
  });

  it("should throw 401 when password is incorrect", async () => {
    const hashedPassword = await hashPassword("Passw0rd!");
    const existingUser: User = {
      id: "1",
      email: "test@example.com",
      password: hashedPassword,
      firstName: "Jean",
      lastName: "Dupont",
      phone: null,
      role: "CLIENT",
      otp_enable: false,
      otp_secret: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fakeRepository = createFakeRepository(existingUser);
    const loginUser = loginUserUsecase(fakeRepository);

    await expect(
      loginUser({ email: "test@example.com", password: "WrongPassword1!" }),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid credentials",
    });
  });

  it("should return requiresOtp true when otp is enabled and no code is provided", async () => {
    const hashedPassword = await hashPassword("Passw0rd!");
    const secret = generateSecret();
    const userWithOtp: User = {
      id: "1",
      email: "otp-user@example.com",
      password: hashedPassword,
      firstName: "Jean",
      lastName: "Dupont",
      phone: null,
      role: "CLIENT",
      otp_enable: true,
      otp_secret: secret,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fakeRepository = createFakeRepository(userWithOtp);
    const loginUser = loginUserUsecase(fakeRepository);

    const result = await loginUser({
      email: "otp-user@example.com",
      password: "Passw0rd!",
    });

    expect(result).toEqual({ requiresOtp: true });
  });

  it("should log in successfully when otp is enabled and a valid code is provided", async () => {
    const hashedPassword = await hashPassword("Passw0rd!");
    const secret = generateSecret();
    const userWithOtp: User = {
      id: "1",
      email: "otp-user@example.com",
      password: hashedPassword,
      firstName: "Jean",
      lastName: "Dupont",
      phone: null,
      role: "CLIENT",
      otp_enable: true,
      otp_secret: secret,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fakeRepository = createFakeRepository(userWithOtp);
    const loginUser = loginUserUsecase(fakeRepository);
    const validCode = await generate({ secret });

    const result = await loginUser({
      email: "otp-user@example.com",
      password: "Passw0rd!",
      code: validCode,
    });

    expect(result.requiresOtp).toBe(false);
    if (!result.requiresOtp) {
      expect(result.token).toBeDefined();
    }
  });

  it("should throw 401 when otp is enabled and an invalid code is provided", async () => {
    const hashedPassword = await hashPassword("Passw0rd!");
    const secret = generateSecret();
    const userWithOtp: User = {
      id: "1",
      email: "otp-user@example.com",
      password: hashedPassword,
      firstName: "Jean",
      lastName: "Dupont",
      phone: null,
      role: "CLIENT",
      otp_enable: true,
      otp_secret: secret,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fakeRepository = createFakeRepository(userWithOtp);
    const loginUser = loginUserUsecase(fakeRepository);

    await expect(
      loginUser({
        email: "otp-user@example.com",
        password: "Passw0rd!",
        code: "000000",
      }),
    ).rejects.toMatchObject({ statusCode: 401, message: "Invalid OTP code" });
  });
});
