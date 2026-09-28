export interface ITotpService {
  generateSecret(): string;
  verify(secret: string, code: string): Promise<boolean>;
}
