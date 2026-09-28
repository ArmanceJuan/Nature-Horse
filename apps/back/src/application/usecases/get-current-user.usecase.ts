import type { User } from "../../domain/entities/user.entity.js";
import { UnauthorizedError } from "../../domain/errors/http-errors.js";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";

export class GetCurrentUserUseCase {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError();
    }

    return user;
  }
}
