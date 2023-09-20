/*
  Warnings:

  - You are about to alter the column `name` on the `areas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `cities` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `countries_tour` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `indonesia_tour` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `firstName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `lastName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `username` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.

*/
-- AlterTable
ALTER TABLE `areas` MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `cities` MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `countries` MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `countries_tour` MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `indonesia_tour` MODIFY `name` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `firstName` VARCHAR(50) NOT NULL,
    MODIFY `lastName` VARCHAR(50) NULL,
    MODIFY `username` VARCHAR(30) NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;
