/*
  Warnings:

  - A unique constraint covering the columns `[stripeSessionId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `stripeSessionId` VARCHAR(191) NULL,
    MODIFY `status` ENUM('AWAITING_PAYMENT', 'PENDING', 'READY_FOR_PICKUP', 'PICKED_UP', 'CANCELLED') NOT NULL DEFAULT 'AWAITING_PAYMENT';

-- CreateIndex
CREATE UNIQUE INDEX `Order_stripeSessionId_key` ON `Order`(`stripeSessionId`);
