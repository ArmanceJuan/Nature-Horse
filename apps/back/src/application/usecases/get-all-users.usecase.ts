import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";

export const getAllUsersUsecase = (userRepository: IUserRepository) => {
  return async () => {
    return userRepository.findAll();
  };
};
