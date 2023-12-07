/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `tours` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `tours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tours` ADD COLUMN `slug` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tours_slug_key` ON `tours`(`slug`);
