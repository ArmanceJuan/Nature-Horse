import type { User } from "../../domain/entities/user.entity.js";
import { UnauthorizedError } from "../../domain/errors/http-errors.js";
import type { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface.js";
import type { ITokenService } from "../../domain/interfaces/token-service.interface.js";
import type { ITotpService } from "../../domain/interfaces/totp-service.interface.js";
import type { ITwoFactorRepository } from "../../domain/interfaces/two-factor-repository.interface.js";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { Email } from "../../domain/value-objects/email.js";

export interface LoginInput {
  email: string;
  password: string;
  code?: string;
}

export type LoginResult =
  | { requiresOtp: true }
  | { requiresOtp: false; user: User; token: string };

export class LoginUserUseCase {
  private readonly userRepository: IUserRepository;
  private readonly passwordHasher: IPasswordHasher;
  private readonly totpService: ITotpService;
  private readonly tokenService: ITokenService;
  private readonly twoFactorRepository: ITwoFactorRepository;

  constructor(
    userRepository: IUserRepository,
    passwordHasher: IPasswordHasher,
    totpService: ITotpService,
    tokenService: ITokenService,
    twoFactorRepository: ITwoFactorRepository,
  ) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.totpService = totpService;
    this.tokenService = tokenService;
    this.twoFactorRepository = twoFactorRepository;
  }

  async execute(input: LoginInput): Promise<LoginResult> {
    const user = await this.findUser(input.email);

    if (!user) {
      await this.passwordHasher.simulateVerification(input.password);
      throw new UnauthorizedError("Invalid credentials");
    }

    if (!(await this.passwordHasher.verify(input.password, user.password))) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (user.otpEnabled) {
      if (!input.code) {
        return { requiresOtp: true };
      }

      await this.ensureOtpIsValid(user, input.code);
    }

    const token = this.tokenService.sign({ userId: user.id, role: user.role });

    return { requiresOtp: false, user, token };
  }

  private async findUser(rawEmail: string): Promise<User | null> {
    const email = Email.tryOf(rawEmail);

    return email ? this.userRepository.findByEmail(email) : null;
  }

  private async ensureOtpIsValid(user: User, code: string): Promise<void> {
    if (
      user.otpSecret &&
      (await this.totpService.verify(user.otpSecret, code))
    ) {
      return;
    }

    if (await this.tryConsumeBackupCode(user.id, code)) {
      return;
    }

    throw new UnauthorizedError("Invalid OTP code");
  }

  private async tryConsumeBackupCode(
    userId: string,
    code: string,
  ): Promise<boolean> {
    const hashes = await this.twoFactorRepository.getBackupCodeHashes(userId);

    for (const hash of hashes) {
      if (await this.passwordHasher.verify(code, hash)) {
        await this.twoFactorRepository.consumeBackupCode(userId, hash);
        return true;
      }
    }

    return false;
  }
}
