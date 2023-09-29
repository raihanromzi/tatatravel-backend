-- DropForeignKey
ALTER TABLE `blog_images` DROP FOREIGN KEY `blog_images_blogId_fkey`;

-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `blogs_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `blogs_userId_fkey`;

-- DropForeignKey
ALTER TABLE `countries` DROP FOREIGN KEY `countries_areaId_fkey`;

-- DropForeignKey
ALTER TABLE `places` DROP FOREIGN KEY `places_tourId_fkey`;

-- DropForeignKey
ALTER TABLE `tour_countries` DROP FOREIGN KEY `tour_countries_countryId_fkey`;

-- DropForeignKey
ALTER TABLE `tour_countries` DROP FOREIGN KEY `tour_countries_tourId_fkey`;

-- DropForeignKey
ALTER TABLE `tour_images` DROP FOREIGN KEY `tour_images_tourId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_roleId_fkey`;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `countries` ADD CONSTRAINT `countries_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `areas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `places` ADD CONSTRAINT `places_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour_countries` ADD CONSTRAINT `tour_countries_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour_countries` ADD CONSTRAINT `tour_countries_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour_images` ADD CONSTRAINT `tour_images_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_images` ADD CONSTRAINT `blog_images_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `blogs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
