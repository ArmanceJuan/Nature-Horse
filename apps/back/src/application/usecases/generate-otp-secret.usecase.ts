import { NotFoundError } from "../../domain/errors/http-errors.js";
import type { IQrCodeGenerator } from "../../domain/interfaces/qr-code-generator.interface.js";
import type { ITotpService } from "../../domain/interfaces/totp-service.interface.js";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";

export interface OtpSecretResult {
  secret: string;
  qrCode: string;
}

export class GenerateOtpSecretUseCase {
  private readonly userRepository: IUserRepository;
  private readonly totpService: ITotpService;
  private readonly qrCodeGenerator: IQrCodeGenerator;

  constructor(
    userRepository: IUserRepository,
    totpService: ITotpService,
    qrCodeGenerator: IQrCodeGenerator,
  ) {
    this.userRepository = userRepository;
    this.totpService = totpService;
    this.qrCodeGenerator = qrCodeGenerator;
  }

  async execute(userId: string): Promise<OtpSecretResult> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const secret = this.totpService.generateSecret();
    const qrCode = await this.qrCodeGenerator.generate(user.email, secret);

    return { secret, qrCode };
  }
}
