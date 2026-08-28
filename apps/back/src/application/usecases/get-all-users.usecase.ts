import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { sanitizeUser } from "../utils/sanitize-user.util.js";

export const getAllUsersUsecase = (userRepository: IUserRepository) => {
  return async () => {
    const users = await userRepository.findAll();
    return users.map(sanitizeUser);
  };
};
