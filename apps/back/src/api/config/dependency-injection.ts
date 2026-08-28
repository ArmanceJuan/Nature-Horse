import { enableOtpUsecase } from "../../application/usecases/enable-otp.usecase.js";
import { generateOtpSecretUsecase } from "../../application/usecases/generate-otp-secret.usecase.js";
import { getAllUsersUsecase } from "../../application/usecases/get-all-users.usecase.js";
import { loginUserUsecase } from "../../application/usecases/login-user.usecase.js";
import { registerUserUsecase } from "../../application/usecases/register-user.usecase.js";
import { otpBackupCodePrismaRepository } from "../../infrastructure/repositories/otp-backup-code-prisma.repository.js";
import { userPrismaRepository } from "../../infrastructure/repositories/user-prisma.repository.js";
import { QrCodeGenerator } from "../../infrastructure/security/qr-code-generator.util.js";

const qrCodeGenerator = new QrCodeGenerator(
  process.env.APP_NAME || "Nature Horse",
);

export const getAllUsers = getAllUsersUsecase(userPrismaRepository);
export const registerUser = registerUserUsecase(userPrismaRepository);
export const loginUser = loginUserUsecase(userPrismaRepository);
export const generateOtpSecret = generateOtpSecretUsecase(
  userPrismaRepository,
  qrCodeGenerator,
);
export const enableOtp = enableOtpUsecase(
  userPrismaRepository,
  otpBackupCodePrismaRepository,
);
