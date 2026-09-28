import type { User } from "../../domain/entities/user.entity.js";
import { ConflictError } from "../../domain/errors/http-errors.js";
import type { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface.js";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { Email } from "../../domain/value-objects/email.js";

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export class RegisterUserUseCase {
  private readonly userRepository: IUserRepository;
  private readonly passwordHasher: IPasswordHasher;

  constructor(
    userRepository: IUserRepository,
    passwordHasher: IPasswordHasher,
  ) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(input: RegisterInput): Promise<User> {
    const email = Email.of(input.email);

    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictError("An account with this email already exists");
    }

    const password = await this.passwordHasher.hash(input.password);

    return this.userRepository.create({
      email: email.value,
      password,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: input.phone?.trim() || null,
      role: "CLIENT",
    });
  }
}
