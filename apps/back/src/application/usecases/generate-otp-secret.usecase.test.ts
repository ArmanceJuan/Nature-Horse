import { generateOtpSecretUsecase } from "./generate-otp-secret.usecase.js";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { IQrCodeGenerator } from "../../domain/interfaces/qr-code-generator.interface.js";
import { User } from "../../domain/entities/user.entity.js";

describe("generateOtpSecretUsecase", () => {
  const existingUser: User = {
    id: "1",
    email: "test@example.com",
    password: "hashed",
    firstName: "Jean",
    lastName: "Dupont",
    phone: null,
    role: "CLIENT",
    otp_enable: false,
    otp_secret: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const fakeQrCodeGenerator: IQrCodeGenerator = {
    generate: async () => "data:image/png;base64,fake-qr-code",
  };

  it("should return a secret and QR code for an existing user", async () => {
    const fakeUserRepository: IUserRepository = {
      findAll: async () => [],
      findById: async () => existingUser,
      findByEmail: async () => null,
      create: async (data) => ({
        id: "1",
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: async (id, data) => ({ ...existingUser, ...data }),
    };

    const generateOtpSecret = generateOtpSecretUsecase(
      fakeUserRepository,
      fakeQrCodeGenerator,
    );
    const result = await generateOtpSecret("1");

    expect(result.secret).toBeDefined();
    expect(result.qrCode).toBe("data:image/png;base64,fake-qr-code");
  });

  it("should throw 404 when user does not exist", async () => {
    const fakeUserRepository: IUserRepository = {
      findAll: async () => [],
      findById: async () => null,
      findByEmail: async () => null,
      create: async (data) => ({
        id: "1",
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: async (id, data) => ({ ...existingUser, ...data }),
    };

    const generateOtpSecret = generateOtpSecretUsecase(
      fakeUserRepository,
      fakeQrCodeGenerator,
    );

    await expect(generateOtpSecret("unknown-id")).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
