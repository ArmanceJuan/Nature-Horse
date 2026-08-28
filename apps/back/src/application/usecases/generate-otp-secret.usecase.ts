import { generateSecret } from "otplib";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { IQrCodeGenerator } from "../../domain/interfaces/qr-code-generator.interface.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";

export const generateOtpSecretUsecase = (
  userRepository: IUserRepository,
  qrCodeGenerator: IQrCodeGenerator,
) => {
  return async (userId: string) => {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const secret = generateSecret();
    const qrCode = await qrCodeGenerator.generate(user.email, secret);

    return { secret, qrCode };
  };
};
