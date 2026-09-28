import type { ITwoFactorRepository } from "../../domain/interfaces/two-factor-repository.interface.js";

export interface EnabledTwoFactor {
  userId: string;
  secret: string;
  backupCodeHashes: string[];
}

export class InMemoryTwoFactorRepository implements ITwoFactorRepository {
  readonly enabled: EnabledTwoFactor[] = [];

  async enable(
    userId: string,
    secret: string,
    backupCodeHashes: string[],
  ): Promise<void> {
    this.enabled.push({ userId, secret, backupCodeHashes });
  }
}
