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

  async disable(userId: string): Promise<void> {
    await this.database.$transaction([
      this.database.user.update({
        where: { id: userId },
        data: { otpSecret: null, otpEnabled: false },
      }),
      this.database.a2FBackupCode.deleteMany({ where: { userId } }),
    ]);
  }

  async getBackupCodeHashes(userId: string): Promise<string[]> {
    const row = await this.database.a2FBackupCode.findUnique({
      where: { userId },
    });

    return row ? (row.codesHash as string[]) : [];
  }

  async consumeBackupCode(userId: string, hashToRemove: string): Promise<void> {
    const row = await this.database.a2FBackupCode.findUnique({
      where: { userId },
    });

    if (!row) {
      return;
    }

    const remaining = (row.codesHash as string[]).filter(
      (hash) => hash !== hashToRemove,
    );

    await this.database.a2FBackupCode.update({
      where: { userId },
      data: { codesHash: remaining },
    });
  }
}
