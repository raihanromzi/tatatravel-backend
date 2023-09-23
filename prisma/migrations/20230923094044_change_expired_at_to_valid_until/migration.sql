/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `expiredAt`,
    ADD COLUMN `validUntil` DATETIME NULL;
