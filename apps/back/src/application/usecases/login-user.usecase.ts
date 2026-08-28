import { verify } from "otplib";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { verifyPassword } from "../../infrastructure/security/password.util.js";
import { generateToken } from "../../infrastructure/security/jwt.util.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";
import { sanitizeUser } from "../utils/sanitize-user.util.js";

export interface LoginInput {
  email: string;
  password: string;
  code?: string;
}

export const loginUserUsecase = (userRepository: IUserRepository) => {
  return async (input: LoginInput) => {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await verifyPassword(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    if (user.otp_enable) {
      if (!input.code) {
        return { requiresOtp: true as const };
      }

      const result = await verify({
        secret: user.otp_secret as string,
        token: input.code,
      });

      if (!result.valid) {
        throw new AppError("Invalid OTP code", 401);
      }
    }

    const token = generateToken({ userId: user.id, role: user.role });

    return {
      requiresOtp: false as const,
      user: sanitizeUser(user),
      token,
    };
  };
};
