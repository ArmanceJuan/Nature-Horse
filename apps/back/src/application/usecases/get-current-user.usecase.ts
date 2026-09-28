import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { AppError } from "../../api/middlewares/error-handler.middleware.js";

export const getCurrentUserUsecase = (userRepository: IUserRepository) => {
  return async (userId: string) => {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("Authentication required", 401);
    }

    return user;
  };
};
