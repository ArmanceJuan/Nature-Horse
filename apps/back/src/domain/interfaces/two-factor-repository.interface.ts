export interface ITwoFactorRepository {
  enable(
    userId: string,
    secret: string,
    backupCodeHashes: string[],
  ): Promise<void>;
  disable(userId: string): Promise<void>;
  getBackupCodeHashes(userId: string): Promise<string[]>;
  consumeBackupCode(userId: string, hashToRemove: string): Promise<void>;
}
