import type { ITotpService } from "../../domain/interfaces/totp-service.interface.js";

export class FakeTotpService implements ITotpService {
  static readonly SECRET = "FAKE-SECRET";
  static readonly VALID_CODE = "123456";

  generateSecret(): string {
    return FakeTotpService.SECRET;
  }

  async verify(secret: string, code: string): Promise<boolean> {
    return secret.length > 0 && code === FakeTotpService.VALID_CODE;
  }
}
