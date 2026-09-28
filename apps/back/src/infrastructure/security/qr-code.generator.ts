import qrcode from "qrcode";
import { generateURI } from "otplib";
import type { IQrCodeGenerator } from "../../domain/interfaces/qr-code-generator.interface.js";

export class QrCodeGenerator implements IQrCodeGenerator {
  private readonly issuer: string;

  constructor(issuer: string) {
    this.issuer = issuer;
  }

  async generate(label: string, secret: string): Promise<string> {
    const uri = generateURI({ issuer: this.issuer, label, secret });

    return qrcode.toDataURL(uri);
  }
}
