import type { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface.js";

export class FakePasswordHasher implements IPasswordHasher {
  simulations = 0;

  async hash(plain: string): Promise<string> {
    return `hashed:${plain}`;
  }

  async verify(plain: string, hashed: string): Promise<boolean> {
    return hashed === `hashed:${plain}`;
  }

  async simulateVerification(_plain: string): Promise<void> {
    this.simulations += 1;
  }
}
