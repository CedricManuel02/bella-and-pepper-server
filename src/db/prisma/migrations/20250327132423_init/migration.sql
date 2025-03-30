-- DropForeignKey
ALTER TABLE `tbl_order_status` DROP FOREIGN KEY `tbl_order_status_order_id_fkey`;

-- DropIndex
DROP INDEX `tbl_order_status_order_id_key` ON `tbl_order_status`;

-- AddForeignKey
ALTER TABLE `tbl_order_status` ADD CONSTRAINT `tbl_order_status_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `tbl_orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
