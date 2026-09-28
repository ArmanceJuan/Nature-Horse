/*
  Warnings:

  - A unique constraint covering the columns `[trackingToken]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerEmail` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerFirstName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerLastName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupReadyAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackingToken` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropIndex
DROP INDEX `Order_userId_fkey` ON `Order`;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `customerEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerFirstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerLastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerPhone` VARCHAR(191) NULL,
    ADD COLUMN `pickupReadyAt` DATETIME(3) NOT NULL,
    ADD COLUMN `trackingToken` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Stock` ADD COLUMN `alertThreshold` INTEGER NOT NULL DEFAULT 5;

-- CreateTable
CREATE TABLE `UserStore` (
    `userId` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`, `storeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockAlert` (
    `id` VARCHAR(191) NOT NULL,
    `stockId` VARCHAR(191) NOT NULL,
    `stockLevel` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'HANDLED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `handledAt` DATETIME(3) NULL,

    INDEX `StockAlert_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Order_trackingToken_key` ON `Order`(`trackingToken`);

-- CreateIndex
CREATE INDEX `Order_customerEmail_idx` ON `Order`(`customerEmail`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_slug_key` ON `Product`(`slug`);

-- AddForeignKey
ALTER TABLE `UserStore` ADD CONSTRAINT `UserStore_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserStore` ADD CONSTRAINT `UserStore_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockAlert` ADD CONSTRAINT `StockAlert_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
