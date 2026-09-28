import type { ITwoFactorRepository } from "../../domain/interfaces/two-factor-repository.interface.js";
import type { DatabaseClient } from "../database/database-client.js";

export class TwoFactorPrismaRepository implements ITwoFactorRepository {
  private readonly database: DatabaseClient;

  constructor(database: DatabaseClient) {
    this.database = database;
  }

  async enable(
    userId: string,
    secret: string,
    backupCodeHashes: string[],
  ): Promise<void> {
    await this.database.$transaction([
      this.database.user.update({
        where: { id: userId },
        data: { otpSecret: secret, otpEnabled: true },
      }),
      this.database.a2FBackupCode.upsert({
        where: { userId },
        update: { codesHash: backupCodeHashes },
        create: { userId, codesHash: backupCodeHashes },
      }),
    ]);
  }
}
