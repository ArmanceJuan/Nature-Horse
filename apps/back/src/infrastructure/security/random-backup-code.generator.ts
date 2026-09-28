import crypto from "crypto";
import type { IBackupCodeGenerator } from "../../domain/interfaces/backup-code-generator.interface.js";

export class RandomBackupCodeGenerator implements IBackupCodeGenerator {
  generate(count: number): string[] {
    return Array.from({ length: count }, () =>
      crypto.randomBytes(4).toString("hex").toUpperCase(),
    );
  }
}
