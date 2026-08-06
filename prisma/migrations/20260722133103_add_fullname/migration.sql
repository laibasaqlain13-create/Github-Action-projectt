/*
  Warnings:

  - You are about to drop the column `senderRole` on the `message` table. All the data in the column will be lost.
  - You are about to drop the `subscription` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `subscription` DROP FOREIGN KEY `Subscription_artisanId_fkey`;

-- DropIndex
DROP INDEX `Message_senderId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `senderRole`,
    ADD COLUMN `isRead` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `receiverId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `subscription`;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `messageId` INTEGER NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
