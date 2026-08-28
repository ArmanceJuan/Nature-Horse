export interface OtpBackupCode {
  id: string;
  userId: string;
  codesHash: string[];
  createdAt: Date;
  updatedAt: Date;
}
