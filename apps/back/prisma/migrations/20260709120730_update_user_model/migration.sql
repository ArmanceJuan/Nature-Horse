/*
  Warnings:

  - You are about to drop the column `isTwoFactorEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `totpSecretKey` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `isTwoFactorEnabled`,
    DROP COLUMN `totpSecretKey`,
    ADD COLUMN `otp_enable` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `otp_secret` VARCHAR(191) NULL;
