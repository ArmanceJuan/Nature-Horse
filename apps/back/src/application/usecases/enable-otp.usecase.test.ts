import { generateSecret, generate } from "otplib";
import { enableOtpUsecase } from "./enable-otp.usecase.js";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { IOtpBackupCodeRepository } from "../../domain/interfaces/otp-backup-code-repository.interface.js";
import { User } from "../../domain/entities/user.entity.js";

describe("enableOtpUsecase", () => {
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

  const fakeOtpBackupCodeRepository: IOtpBackupCodeRepository = {
    upsert: async (userId, codesHash) => ({
      id: "1",
      userId,
      codesHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    findByUserId: async () => null,
  };

  it("should enable OTP with a valid code and return backup codes", async () => {
    const secret = generateSecret();
    const validCode = await generate({ secret });

    const enableOtp = enableOtpUsecase(
      fakeUserRepository,
      fakeOtpBackupCodeRepository,
    );

    const result = await enableOtp({
      userId: "1",
      secret,
      code: validCode,
    });

    expect(result.message).toBe("2FA enabled successfully");
    expect(result.backupCodes).toHaveLength(5);
  });

  it("should throw 400 with an invalid code", async () => {
    const secret = generateSecret();

    const enableOtp = enableOtpUsecase(
      fakeUserRepository,
      fakeOtpBackupCodeRepository,
    );

    await expect(
      enableOtp({ userId: "1", secret, code: "000000" }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
