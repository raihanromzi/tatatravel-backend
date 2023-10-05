/*
  Warnings:

  - You are about to alter the column `dateStart` on the `tours` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to alter the column `dateEnd` on the `tours` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to alter the column `duration` on the `tours` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.

*/
-- AlterTable
ALTER TABLE `tours` MODIFY `dateStart` INTEGER NOT NULL,
    MODIFY `dateEnd` INTEGER NOT NULL,
    MODIFY `duration` INTEGER NOT NULL;
