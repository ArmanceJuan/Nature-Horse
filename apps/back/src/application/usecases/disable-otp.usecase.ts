import {
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import type { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface.js";
import type { ITwoFactorRepository } from "../../domain/interfaces/two-factor-repository.interface.js";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";

export interface DisableOtpInput {
  userId: string;
  password: string;
}

export class DisableOtpUseCase {
  private readonly userRepository: IUserRepository;
  private readonly twoFactorRepository: ITwoFactorRepository;
  private readonly passwordHasher: IPasswordHasher;

  constructor(
    userRepository: IUserRepository,
    twoFactorRepository: ITwoFactorRepository,
    passwordHasher: IPasswordHasher,
  ) {
    this.userRepository = userRepository;
    this.twoFactorRepository = twoFactorRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(input: DisableOtpInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new UnauthorizedError();
    }

    if (!user.otpEnabled) {
      throw new ConflictError("Two-factor authentication is not enabled");
    }

    if (!(await this.passwordHasher.verify(input.password, user.password))) {
      throw new ValidationError("Invalid password");
    }

    await this.twoFactorRepository.disable(user.id);
  }
}
