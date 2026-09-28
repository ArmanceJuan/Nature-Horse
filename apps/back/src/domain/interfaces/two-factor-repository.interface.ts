export interface ITwoFactorRepository {
  enable(
    userId: string,
    secret: string,
    backupCodeHashes: string[],
  ): Promise<void>;
}
