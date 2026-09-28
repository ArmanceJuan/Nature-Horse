import bcrypt from "bcrypt";
import type { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface.js";

export class BcryptPasswordHasher implements IPasswordHasher {
  private static readonly TIMING_PASSWORD = "timing-equalizer";

  private readonly rounds: number;
  private readonly timingHash: Promise<string>;

  constructor(rounds: number = 12) {
    this.rounds = rounds;
    this.timingHash = bcrypt.hash(BcryptPasswordHasher.TIMING_PASSWORD, rounds);
    this.timingHash.catch(() => undefined);
  }

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  verify(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  async simulateVerification(plain: string): Promise<void> {
    await bcrypt.compare(plain, await this.timingHash);
  }
}
