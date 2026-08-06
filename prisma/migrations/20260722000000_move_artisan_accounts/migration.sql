-- Move artisan account credentials from User into Artisan.
ALTER TABLE `Artisan` ADD COLUMN `fullName` VARCHAR(100) NULL,
    ADD COLUMN `email` VARCHAR(100) NULL,
    ADD COLUMN `password` VARCHAR(255) NULL,
    ADD COLUMN `phone` VARCHAR(20) NULL;

UPDATE `Artisan` AS a
INNER JOIN `User` AS u ON u.id = a.userId
SET a.fullName = u.fullName,
    a.email = u.email,
    a.password = u.password,
    a.phone = u.phone;

ALTER TABLE `Message` DROP FOREIGN KEY `Message_senderId_fkey`;
ALTER TABLE `Artisan` DROP FOREIGN KEY `Artisan_userId_fkey`;
ALTER TABLE `Artisan` DROP INDEX `Artisan_userId_key`;

-- Message.senderId is interpreted with Message.senderRole: customer IDs reference User,
-- while artisan IDs reference Artisan.
ALTER TABLE `Artisan` DROP COLUMN `userId`;
ALTER TABLE `Artisan` MODIFY `fullName` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL,
    ADD UNIQUE INDEX `Artisan_email_key`(`email`);

DELETE FROM `User` WHERE `role` = 'ARTISAN';
ALTER TABLE `User` MODIFY `role` ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER';
