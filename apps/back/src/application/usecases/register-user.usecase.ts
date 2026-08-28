import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { User } from "../../domain/entities/user.entity.js";
import { hashPassword } from "../../infrastructure/security/password.util.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";
import { sanitizeUser } from "../utils/sanitize-user.util.js";

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export const registerUserUsecase = (userRepository: IUserRepository) => {
  return async (input: RegisterInput): Promise<Omit<User, "password">> => {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }

    const hashedPassword = await hashPassword(input.password);

    const newUser = await userRepository.create({
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone ?? null,
      role: "CLIENT",
      otp_enable: false,
      otp_secret: null,
    });

    return sanitizeUser(newUser);
  };
};
