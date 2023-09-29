/*
  Warnings:

  - You are about to drop the column `validUntil` on the `users` table. All the data in the column will be lost.
  - Added the required column `duration` to the `tours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tours` ADD COLUMN `duration` VARCHAR(255) NOT NULL,
    MODIFY `dateStart` VARCHAR(255) NOT NULL,
    MODIFY `dateEnd` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `validUntil`;

-- CreateTable
CREATE TABLE `places` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tourId` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `places` ADD CONSTRAINT `places_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
