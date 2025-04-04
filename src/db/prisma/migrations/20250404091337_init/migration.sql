-- CreateTable
CREATE TABLE `tbl_shipping_fee` (
    `shipping_fee_id` VARCHAR(191) NOT NULL,
    `province_id` VARCHAR(191) NOT NULL,
    `province_name` VARCHAR(191) NOT NULL,
    `shipping_fee_rate` INTEGER NOT NULL,
    `expected_shipping_days` INTEGER NOT NULL,
    `shipping_fee_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `shipping_fee_date_updated` DATETIME(3) NULL,
    `shipping_fee_date_deleted` DATETIME(3) NULL,

    UNIQUE INDEX `tbl_shipping_fee_shipping_fee_id_key`(`shipping_fee_id`),
    PRIMARY KEY (`shipping_fee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_categories` (
    `category_id` VARCHAR(191) NOT NULL,
    `category_name` VARCHAR(191) NOT NULL,
    `category_image_url` VARCHAR(191) NOT NULL,
    `category_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `category_date_updated` DATETIME(3) NULL,
    `category_date_deleted` DATETIME(3) NULL,

    UNIQUE INDEX `tbl_categories_category_id_key`(`category_id`),
    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_users` (
    `user_id` VARCHAR(191) NOT NULL,
    `roles` ENUM('ADMIN', 'USER') NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `user_phone` VARCHAR(191) NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `user_password` VARCHAR(191) NOT NULL,
    `user_profile` VARCHAR(191) NULL,
    `user_is_verified` VARCHAR(191) NULL,
    `user_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_date_updated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_users_user_id_key`(`user_id`),
    UNIQUE INDEX `tbl_users_user_email_key`(`user_email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_reset_token` (
    `reset_token_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `reset_token_hash` VARCHAR(191) NOT NULL,
    `reset_token_expires_at` DATETIME(3) NOT NULL,
    `reset_token_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbl_reset_token_reset_token_id_key`(`reset_token_id`),
    UNIQUE INDEX `tbl_reset_token_user_id_key`(`user_id`),
    PRIMARY KEY (`reset_token_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_session` (
    `session_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `session_token` TEXT NOT NULL,
    `session_expires_at` DATETIME(3) NOT NULL,
    `session_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `session_date_updated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_session_session_id_key`(`session_id`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_notifications` (
    `notifications_id` VARCHAR(191) NOT NULL,
    `notifications_title` VARCHAR(191) NOT NULL,
    `notifications_body` VARCHAR(191) NOT NULL,
    `notifications_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notifications_read` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('CANCELLED', 'APPROVED', 'PAID', 'REFUNDED', 'PLACED_ORDER', 'RATING', 'SHIPPED', 'DELIVERED') NOT NULL,
    `user_sender_id` VARCHAR(191) NULL,
    `user_receiver_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NULL,
    `product_id` VARCHAR(191) NULL,

    PRIMARY KEY (`notifications_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_products` (
    `product_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `product_upc_number` VARCHAR(191) NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,
    `product_description` TEXT NOT NULL,
    `product_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `product_date_updated` DATETIME(3) NULL,
    `product_date_deleted` DATETIME(3) NULL,

    UNIQUE INDEX `tbl_products_product_id_key`(`product_id`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_variants` (
    `variant_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `variant_name` VARCHAR(191) NOT NULL,
    `variant_price` DECIMAL(65, 30) NOT NULL,
    `variant_stocks` INTEGER NOT NULL,
    `variant_image_url` VARCHAR(191) NOT NULL,
    `variant_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `variant_date_deleted` DATETIME(3) NULL,

    UNIQUE INDEX `tbl_variants_variant_id_key`(`variant_id`),
    PRIMARY KEY (`variant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_discount` (
    `discount_id` VARCHAR(191) NOT NULL,
    `discount_percentage` INTEGER NOT NULL,
    `discount_end_date` DATETIME(3) NOT NULL,
    `discount_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `discount_date_updated` DATETIME(3) NULL,
    `discount_date_deleted` DATETIME(3) NULL,

    UNIQUE INDEX `tbl_discount_discount_id_key`(`discount_id`),
    PRIMARY KEY (`discount_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_variant_item` (
    `variant_discount_id` VARCHAR(191) NOT NULL,
    `discount_id` VARCHAR(191) NOT NULL,
    `variant_id` VARCHAR(191) NOT NULL,
    `variant_discount_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `variant_discount_date_deleted` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbl_variant_item_variant_discount_id_key`(`variant_discount_id`),
    UNIQUE INDEX `tbl_variant_item_variant_id_discount_id_key`(`variant_id`, `discount_id`),
    PRIMARY KEY (`variant_discount_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_rating` (
    `rating_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `variant_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `rating_text` TEXT NULL,
    `rating_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbl_rating_rating_id_key`(`rating_id`),
    PRIMARY KEY (`rating_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_rating_media` (
    `media_id` VARCHAR(191) NOT NULL,
    `rating_id` VARCHAR(191) NOT NULL,
    `media_path` TEXT NOT NULL,

    UNIQUE INDEX `tbl_rating_media_media_id_key`(`media_id`),
    UNIQUE INDEX `tbl_rating_media_rating_id_key`(`rating_id`),
    PRIMARY KEY (`media_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_order_status` (
    `order_status_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `status` ENUM('CANCELLED', 'APPROVED', 'PAID', 'REFUNDED', 'PLACED_ORDER', 'RATING', 'SHIPPED', 'DELIVERED') NOT NULL,
    `order_status_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbl_order_status_order_status_id_key`(`order_status_id`),
    PRIMARY KEY (`order_status_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_order_status_images` (
    `order_status_image_id` VARCHAR(191) NOT NULL,
    `order_status_id` VARCHAR(191) NOT NULL,
    `order_status_image` TEXT NULL,

    UNIQUE INDEX `tbl_order_status_images_order_status_image_id_key`(`order_status_image_id`),
    PRIMARY KEY (`order_status_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_orders` (
    `order_id` VARCHAR(191) NOT NULL,
    `order_number` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `order_shipping_fee` INTEGER NOT NULL,
    `shipping_fee_id` VARCHAR(191) NOT NULL,
    `order_target_date_received` DATETIME(3) NOT NULL,
    `order_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `order_policy_aggreement` BOOLEAN NOT NULL,

    UNIQUE INDEX `tbl_orders_order_id_key`(`order_id`),
    UNIQUE INDEX `tbl_orders_order_number_key`(`order_number`),
    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_order_payment` (
    `payment_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `payment_method` VARCHAR(191) NULL,
    `payment_unique_id` VARCHAR(191) NULL,
    `payment_intent_id` VARCHAR(191) NULL,
    `payment_transaction_fee` INTEGER NULL,
    `payment_status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `payment_date_paid` DATETIME(3) NULL,
    `payment_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbl_order_payment_payment_id_key`(`payment_id`),
    UNIQUE INDEX `tbl_order_payment_order_id_key`(`order_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_delivery_information` (
    `delivery_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `delivery_company` VARCHAR(191) NOT NULL,
    `delivery_rider_name` VARCHAR(191) NOT NULL,
    `delivery_rider_phone` VARCHAR(191) NOT NULL,
    `delivery_plate_number` VARCHAR(191) NOT NULL,
    `delivery_tracking_number` VARCHAR(191) NOT NULL,
    `delivery_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbl_delivery_information_delivery_id_key`(`delivery_id`),
    UNIQUE INDEX `tbl_delivery_information_order_id_key`(`order_id`),
    PRIMARY KEY (`delivery_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_order_information` (
    `order_information_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `order_information_first_name` VARCHAR(191) NOT NULL,
    `order_information_last_name` VARCHAR(191) NOT NULL,
    `order_information_email` VARCHAR(191) NOT NULL,
    `order_information_phone` VARCHAR(191) NOT NULL,
    `order_address_complete` VARCHAR(191) NOT NULL,
    `order_address_cities` VARCHAR(191) NOT NULL,
    `order_address_province` VARCHAR(191) NOT NULL,
    `order_address_barangay` VARCHAR(191) NOT NULL,
    `order_information_user_longitude` VARCHAR(191) NOT NULL,
    `order_information_user_latitude` VARCHAR(191) NOT NULL,
    `order_information_delivery_longitude` VARCHAR(191) NOT NULL,
    `order_information_delivery_latitude` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_order_information_order_information_id_key`(`order_information_id`),
    UNIQUE INDEX `tbl_order_information_order_id_key`(`order_id`),
    PRIMARY KEY (`order_information_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_items` (
    `item_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `variant_id` VARCHAR(191) NOT NULL,
    `item_product_price_at_time_purchase` INTEGER NOT NULL,
    `item_product_discount_at_time_purchase` INTEGER NULL,
    `item_quantity` INTEGER NOT NULL,
    `item_product_image` TEXT NOT NULL,
    `item_product_name` VARCHAR(191) NOT NULL,
    `item_variant_name` VARCHAR(191) NOT NULL,
    `item_product_variant` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_items_item_id_key`(`item_id`),
    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_cart` (
    `cart_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `variant_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `cart_item_quantity` INTEGER NOT NULL,
    `cart_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cart_date_updated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_cart_cart_id_key`(`cart_id`),
    UNIQUE INDEX `tbl_cart_variant_id_key`(`variant_id`),
    PRIMARY KEY (`cart_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_cancelled_order` (
    `cancelled_order_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `cancelled_reason` ENUM('CHANGE_OF_ADDRESS', 'FRAUDULENT_ORDER', 'SHIPPING_DELAY', 'DUPLICATE_ORDER', 'PAYMENT_FAILED', 'OTHER') NOT NULL,
    `cancelled_order_date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbl_cancelled_order_order_id_key`(`order_id`),
    PRIMARY KEY (`cancelled_order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_order_refund` (
    `refund_id` VARCHAR(191) NOT NULL,
    `payment_id` VARCHAR(191) NOT NULL,
    `refund_is_approved` BOOLEAN NOT NULL DEFAULT false,
    `payment_refunded_amount` INTEGER NOT NULL,
    `payment_refunded_notes` VARCHAR(191) NOT NULL,
    `payment_refunded_reason` ENUM('DUPLICATE', 'FRAUDULENT', 'CANCELLED', 'REQUESTED_BY_CUSTOMER', 'OTHERS') NOT NULL,
    `payment_date_refunded` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `payment_refund_date_approved` DATETIME(3) NULL,
    `payment_refund_date_denied` DATETIME(3) NULL,

    UNIQUE INDEX `tbl_order_refund_payment_id_key`(`payment_id`),
    PRIMARY KEY (`refund_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_reset_token` ADD CONSTRAINT `tbl_reset_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_session` ADD CONSTRAINT `tbl_session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_notifications` ADD CONSTRAINT `tbl_notifications_user_sender_id_fkey` FOREIGN KEY (`user_sender_id`) REFERENCES `tbl_users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_notifications` ADD CONSTRAINT `tbl_notifications_user_receiver_id_fkey` FOREIGN KEY (`user_receiver_id`) REFERENCES `tbl_users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_notifications` ADD CONSTRAINT `tbl_notifications_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `tbl_orders`(`order_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_notifications` ADD CONSTRAINT `tbl_notifications_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `tbl_products`(`product_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_products` ADD CONSTRAINT `tbl_products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `tbl_categories`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_variants` ADD CONSTRAINT `tbl_variants_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `tbl_products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_variant_item` ADD CONSTRAINT `tbl_variant_item_discount_id_fkey` FOREIGN KEY (`discount_id`) REFERENCES `tbl_discount`(`discount_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_variant_item` ADD CONSTRAINT `tbl_variant_item_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `tbl_variants`(`variant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_rating` ADD CONSTRAINT `tbl_rating_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `tbl_products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_rating` ADD CONSTRAINT `tbl_rating_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `tbl_variants`(`variant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_rating` ADD CONSTRAINT `tbl_rating_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `tbl_orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_rating` ADD CONSTRAINT `tbl_rating_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_rating_media` ADD CONSTRAINT `tbl_rating_media_rating_id_fkey` FOREIGN KEY (`rating_id`) REFERENCES `tbl_rating`(`rating_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_order_status` ADD CONSTRAINT `tbl_order_status_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `tbl_orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_order_status_images` ADD CONSTRAINT `tbl_order_status_images_order_status_id_fkey` FOREIGN KEY (`order_status_id`) REFERENCES `tbl_order_status`(`order_status_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_orders` ADD CONSTRAINT `tbl_orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_orders` ADD CONSTRAINT `tbl_orders_shipping_fee_id_fkey` FOREIGN KEY (`shipping_fee_id`) REFERENCES `tbl_shipping_fee`(`shipping_fee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_order_payment` ADD CONSTRAINT `tbl_order_payment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `tbl_orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_delivery_information` ADD CONSTRAINT `tbl_delivery_information_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `tbl_orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_order_information` ADD CONSTRAINT `tbl_order_information_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `tbl_orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_items` ADD CONSTRAINT `tbl_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `tbl_orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_items` ADD CONSTRAINT `tbl_items_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `tbl_variants`(`variant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_items` ADD CONSTRAINT `tbl_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `tbl_products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_cart` ADD CONSTRAINT `tbl_cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `tbl_products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_cart` ADD CONSTRAINT `tbl_cart_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `tbl_variants`(`variant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_cart` ADD CONSTRAINT `tbl_cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `tbl_users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_cancelled_order` ADD CONSTRAINT `tbl_cancelled_order_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `tbl_orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_order_refund` ADD CONSTRAINT `tbl_order_refund_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `tbl_order_payment`(`payment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
