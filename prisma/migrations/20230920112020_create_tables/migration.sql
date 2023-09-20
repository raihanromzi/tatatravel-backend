-- CreateTable
CREATE TABLE `users`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `roleId`    INTEGER      NOT NULL,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName`  VARCHAR(100) NULL,
    `username`  VARCHAR(100) NOT NULL,
    `email`     VARCHAR(100) NOT NULL,
    `password`  VARCHAR(100) NOT NULL,
    `isActive`  BOOLEAN      NOT NULL DEFAULT true,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    UNIQUE INDEX `users_username_key` (`username`),
    UNIQUE INDEX `users_email_key` (`email`),
    INDEX `users_username_idx` (`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(191) NOT NULL,
    `isActive`  BOOLEAN      NOT NULL DEFAULT true,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    UNIQUE INDEX `roles_name_key` (`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(191) NOT NULL,
    `isActive`  BOOLEAN      NOT NULL DEFAULT true,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    UNIQUE INDEX `categories_name_key` (`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog`
(
    `id`          INTEGER      NOT NULL AUTO_INCREMENT,
    `userId`      INTEGER      NOT NULL,
    `categoryId`  INTEGER      NOT NULL,
    `title`       VARCHAR(255) NOT NULL,
    `slug`        VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `content`     TEXT         NOT NULL,
    `isActive`    BOOLEAN      NOT NULL DEFAULT true,
    `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3)  NOT NULL,

    UNIQUE INDEX `blog_slug_key` (`slug`),
    INDEX `blog_slug_idx` (`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `areas`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(255) NOT NULL,
    `areaId`    INTEGER      NOT NULL,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cities`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(255) NOT NULL,
    `countryId` INTEGER      NOT NULL,
    `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indonesia_tour`
(
    `id`          INTEGER      NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(255) NOT NULL,
    `cityId`      INTEGER      NOT NULL,
    `price`       VARCHAR(255) NOT NULL,
    `dateStart`   DATETIME(3)  NOT NULL,
    `dateEnd`     DATETIME(3)  NOT NULL,
    `description` VARCHAR(255) NULL,
    `isActive`    BOOLEAN      NOT NULL DEFAULT true,
    `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3)  NOT NULL,

    INDEX `indonesia_tour_name_idx` (`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries_tour`
(
    `id`          INTEGER      NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(255) NOT NULL,
    `countryId`   INTEGER      NOT NULL,
    `price`       VARCHAR(255) NOT NULL,
    `dateStart`   DATETIME(3)  NOT NULL,
    `dateEnd`     DATETIME(3)  NOT NULL,
    `description` VARCHAR(255) NULL,
    `isActive`    BOOLEAN      NOT NULL DEFAULT true,
    `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3)  NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users`
    ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog`
    ADD CONSTRAINT `blog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog`
    ADD CONSTRAINT `blog_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `countries`
    ADD CONSTRAINT `countries_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `areas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cities`
    ADD CONSTRAINT `cities_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `countries` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indonesia_tour`
    ADD CONSTRAINT `indonesia_tour_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `countries_tour`
    ADD CONSTRAINT `countries_tour_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `countries` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
