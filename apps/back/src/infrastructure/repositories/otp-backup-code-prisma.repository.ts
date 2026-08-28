import { prisma } from "../../config/prisma.js";
import { IOtpBackupCodeRepository } from "../../domain/interfaces/otp-backup-code-repository.interface.js";

export const otpBackupCodePrismaRepository: IOtpBackupCodeRepository = {
  upsert: async (userId: string, codesHash: string[]) => {
    const result = await prisma.a2FBackupCode.upsert({
      where: { userId },
      update: { codesHash },
      create: { userId, codesHash },
    });

    return {
      ...result,
      codesHash: result.codesHash as string[],
    };
  },

  findByUserId: async (userId: string) => {
    const result = await prisma.a2FBackupCode.findUnique({
      where: { userId },
    });

    if (!result) return null;

    return {
      ...result,
      codesHash: result.codesHash as string[],
    };
  },
};
