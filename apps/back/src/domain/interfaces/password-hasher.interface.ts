export interface IPasswordHasher {
  hash(plain: string): Promise<string>;
  verify(plain: string, hashed: string): Promise<boolean>;
  simulateVerification(plain: string): Promise<void>;
}
