import { generateSecret as createSecret, verify as verifyToken } from "otplib";
import type { ITotpService } from "../../domain/interfaces/totp-service.interface.js";

export class OtplibTotpService implements ITotpService {
  private static readonly CODE_PATTERN = /^\d{6}$/;

  generateSecret(): string {
    return createSecret();
  }

  async verify(secret: string, code: string): Promise<boolean> {
    if (!OtplibTotpService.CODE_PATTERN.test(code)) {
      return false;
    }

    const result = await verifyToken({ secret, token: code });

    return result.valid;
  }
}
