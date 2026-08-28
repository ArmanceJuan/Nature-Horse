import { verify } from "otplib";
import bcrypt from "bcrypt";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { IOtpBackupCodeRepository } from "../../domain/interfaces/otp-backup-code-repository.interface.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";
import { generateBackupCodes } from "../../infrastructure/security/backup-codes.util.js";

export interface EnableOtpInput {
  userId: string;
  secret: string;
  code: string;
}

export const enableOtpUsecase = (
  userRepository: IUserRepository,
  otpBackupCodeRepository: IOtpBackupCodeRepository,
) => {
  return async (input: EnableOtpInput) => {
    const result = await verify({ secret: input.secret, token: input.code });

    if (!result.valid) {
      throw new AppError("Invalid OTP code", 400);
    }

    await userRepository.update(input.userId, {
      otp_secret: input.secret,
      otp_enable: true,
    });

    const backupCodes = generateBackupCodes(5);
    const codesHash = await Promise.all(
      backupCodes.map((code) => bcrypt.hash(code, 12)),
    );

    await otpBackupCodeRepository.upsert(input.userId, codesHash);

    return { message: "2FA enabled successfully", backupCodes };
  };
};
