import crypto from "crypto";

export const generateBackupCodes = (count: number): string[] => {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString("hex").toUpperCase(),
  );
};
