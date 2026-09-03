/*
  Warnings:

  - Added the required column `openingHours` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Store` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `openingHours` JSON NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NOT NULL;
