import type { IQrCodeGenerator } from "../../domain/interfaces/qr-code-generator.interface.js";

export class FakeQrCodeGenerator implements IQrCodeGenerator {
  async generate(label: string, secret: string): Promise<string> {
    return `qr:${label}:${secret}`;
  }
}
