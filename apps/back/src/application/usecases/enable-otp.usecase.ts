import {
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import type { IBackupCodeGenerator } from "../../domain/interfaces/backup-code-generator.interface.js";
import type { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface.js";
import type { ITotpService } from "../../domain/interfaces/totp-service.interface.js";
import type { ITwoFactorRepository } from "../../domain/interfaces/two-factor-repository.interface.js";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";

export interface EnableOtpInput {
  userId: string;
  password: string;
  secret: string;
  code: string;
}

export interface EnableOtpResult {
  message: string;
  backupCodes: string[];
}

export class EnableOtpUseCase {
  static readonly BACKUP_CODE_COUNT = 5;

  private readonly userRepository: IUserRepository;
  private readonly twoFactorRepository: ITwoFactorRepository;
  private readonly totpService: ITotpService;
  private readonly backupCodeGenerator: IBackupCodeGenerator;
  private readonly passwordHasher: IPasswordHasher;

  constructor(
    userRepository: IUserRepository,
    twoFactorRepository: ITwoFactorRepository,
    totpService: ITotpService,
    backupCodeGenerator: IBackupCodeGenerator,
    passwordHasher: IPasswordHasher,
  ) {
    this.userRepository = userRepository;
    this.twoFactorRepository = twoFactorRepository;
    this.totpService = totpService;
    this.backupCodeGenerator = backupCodeGenerator;
    this.passwordHasher = passwordHasher;
  }

  async execute(input: EnableOtpInput): Promise<EnableOtpResult> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new UnauthorizedError();
    }

    if (user.otpEnabled) {
      throw new ConflictError("Two-factor authentication is already enabled");
    }

    if (!(await this.passwordHasher.verify(input.password, user.password))) {
      throw new ValidationError("Invalid password");
    }

    if (!(await this.totpService.verify(input.secret, input.code))) {
      throw new ValidationError("Invalid OTP code");
    }

    const backupCodes = this.backupCodeGenerator.generate(
      EnableOtpUseCase.BACKUP_CODE_COUNT,
    );
    const hashes = await Promise.all(
      backupCodes.map((code) => this.passwordHasher.hash(code)),
    );

    await this.twoFactorRepository.enable(user.id, input.secret, hashes);

    return { message: "2FA enabled successfully", backupCodes };
  }
}
