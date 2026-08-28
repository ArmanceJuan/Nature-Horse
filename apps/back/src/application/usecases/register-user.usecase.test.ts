import { registerUserUsecase } from "./register-user.usecase.js";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { User } from "../../domain/entities/user.entity.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";

describe("registerUserUsecase", () => {
  const existingUser: User = {
    id: "1",
    email: "existing@example.com",
    password: "hashedpassword",
    firstName: "Existing",
    lastName: "User",
    phone: null,
    role: "CLIENT",
    otp_enable: false,
    otp_secret: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createFakeRepository = (userToFind: User | null): IUserRepository => ({
    findAll: async () => [],
    findById: async () => null,
    findByEmail: async () => userToFind,
    create: async (data) => ({
      id: "new-id",
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: async (id, data) => ({ ...existingUser, ...data }),
  });

  it("should create a new user when email does not exist", async () => {
    const fakeRepository = createFakeRepository(null);
    const registerUser = registerUserUsecase(fakeRepository);

    const result = await registerUser({
      email: "new@example.com",
      password: "Passw0rd!",
      firstName: "Jean",
      lastName: "Dupont",
    });

    expect(result.email).toBe("new@example.com");
    expect(result).not.toHaveProperty("password");
  });

  it("should throw an AppError with 409 when email already exists", async () => {
    const fakeRepository = createFakeRepository(existingUser);
    const registerUser = registerUserUsecase(fakeRepository);

    await expect(
      registerUser({
        email: "existing@example.com",
        password: "Passw0rd!",
        firstName: "Jean",
        lastName: "Dupont",
      }),
    ).rejects.toThrow(AppError);

    await expect(
      registerUser({
        email: "existing@example.com",
        password: "Passw0rd!",
        firstName: "Jean",
        lastName: "Dupont",
      }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});
