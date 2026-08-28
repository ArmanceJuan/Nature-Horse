import qrcode from "qrcode";
import { generateURI } from "otplib";
import { IQrCodeGenerator } from "../../domain/interfaces/qr-code-generator.interface.js";

export class QrCodeGenerator implements IQrCodeGenerator {
  constructor(private readonly appName: string) {}

  generate = async (username: string, secret: string): Promise<string> => {
    const otpAuthUrl = generateURI({
      issuer: this.appName,
      label: username,
      secret,
    });
    return qrcode.toDataURL(otpAuthUrl);
  };
}
