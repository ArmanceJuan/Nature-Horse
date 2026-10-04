import type { InMemoryUserRepository } from "./in-memory-user.repository.js";

export interface EnabledTwoFactor {
  userId: string;
  secret: string;
  backupCodeHashes: string[];
}

interface TwoFactorState {
  secret: string;
  backupCodeHashes: string[];
}

export class InMemoryTwoFactorRepository {
  private readonly state = new Map<string, TwoFactorState>();
  private readonly userRepository: InMemoryUserRepository | null;

  readonly enabled: EnabledTwoFactor[] = [];
  readonly disabledUserIds: string[] = [];

  constructor(
    seed: Record<string, TwoFactorState> = {},
    userRepository: InMemoryUserRepository | null = null,
  ) {
    Object.entries(seed).forEach(([userId, value]) =>
      this.state.set(userId, {
        secret: value.secret,
        backupCodeHashes: [...value.backupCodeHashes],
      }),
    );
    this.userRepository = userRepository;
  }

  async enable(
    userId: string,
    secret: string,
    backupCodeHashes: string[],
  ): Promise<void> {
    this.state.set(userId, { secret, backupCodeHashes: [...backupCodeHashes] });
    this.enabled.push({ userId, secret, backupCodeHashes });
    this.userRepository?.setOtpStatus(userId, true, secret);
  }

  async disable(userId: string): Promise<void> {
    this.state.delete(userId);
    this.disabledUserIds.push(userId);
    this.userRepository?.setOtpStatus(userId, false, null);
  }

  async getBackupCodeHashes(userId: string): Promise<string[]> {
    return this.state.get(userId)?.backupCodeHashes ?? [];
  }

  async consumeBackupCode(userId: string, hashToRemove: string): Promise<void> {
    const entry = this.state.get(userId);

    if (!entry) {
      return;
    }

    entry.backupCodeHashes = entry.backupCodeHashes.filter(
      (hash) => hash !== hashToRemove,
    );
  }
}
