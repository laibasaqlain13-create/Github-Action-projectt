ALTER TABLE `PasswordReset` MODIFY `userId` INTEGER NULL,
    ADD COLUMN `artisanId` INTEGER NULL;

ALTER TABLE `PasswordReset` ADD CONSTRAINT `PasswordReset_artisanId_fkey`
    FOREIGN KEY (`artisanId`) REFERENCES `Artisan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
