import { OtpBackupCode } from "../entities/otp-backup-code.entity.js";

export interface IOtpBackupCodeRepository {
  upsert: (userId: string, codesHash: string[]) => Promise<OtpBackupCode>;
  findByUserId: (userId: string) => Promise<OtpBackupCode | null>;
}
