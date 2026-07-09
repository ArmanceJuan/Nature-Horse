import { userRepository } from "../repositories/user.repository.js";

export const userService = {
  async getAllUsers() {
    const users = await userRepository.findAll();
    return users;
  },
};
