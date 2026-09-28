export interface IQrCodeGenerator {
  generate(label: string, secret: string): Promise<string>;
}
