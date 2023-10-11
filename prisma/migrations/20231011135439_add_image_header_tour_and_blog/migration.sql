/*
  Warnings:

  - You are about to drop the column `description` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tours` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imgHead` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imgHead` to the `tours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users_username_idx` ON `users`;

-- DropIndex
DROP INDEX `users_username_key` ON `users`;

-- AlterTable
ALTER TABLE `blogs` DROP COLUMN `description`,
    ADD COLUMN `desc` VARCHAR(255) NULL,
    ADD COLUMN `imgHead` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `tours` DROP COLUMN `description`,
    ADD COLUMN `desc` VARCHAR(255) NULL,
    ADD COLUMN `imgHead` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `username`,
    ADD COLUMN `userName` VARCHAR(30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_userName_key` ON `users`(`userName`);

-- CreateIndex
CREATE INDEX `users_userName_idx` ON `users`(`userName`);
