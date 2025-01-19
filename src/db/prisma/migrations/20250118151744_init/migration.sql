-- CreateTable
CREATE TABLE `tbl_user` (
    `user_id` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `user_phone` VARCHAR(191) NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `user_password` VARCHAR(191) NOT NULL,
    `user_profile` VARCHAR(191) NULL,
    `user_is_verified` VARCHAR(191) NULL,
    `user_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_date_updated` DATETIME(3) NOT NULL,
    `reset_token_hash` VARCHAR(191) NULL,
    `reset_token_expires_at` DATETIME(3) NULL,

    UNIQUE INDEX `tbl_user_user_email_key`(`user_email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
