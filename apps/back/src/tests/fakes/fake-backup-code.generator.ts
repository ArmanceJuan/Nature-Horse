import type { IBackupCodeGenerator } from "../../domain/interfaces/backup-code-generator.interface.js";

export class FakeBackupCodeGenerator implements IBackupCodeGenerator {
  generate(count: number): string[] {
    return Array.from({ length: count }, (_, index) => `CODE${index + 1}`);
  }
}
