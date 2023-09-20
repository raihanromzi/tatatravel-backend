/*
  Warnings:

  - You are about to drop the column `Token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `Token`,
    ADD COLUMN `expiredAt` DATETIME NULL,
    ADD COLUMN `token` VARCHAR(255) NULL;
