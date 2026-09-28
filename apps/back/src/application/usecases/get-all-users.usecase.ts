import type { User } from "../../domain/entities/user.entity.js";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";

export class GetAllUsersUseCase {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
