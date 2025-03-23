/*
  Warnings:

  - The values [ADMIN,USER] on the enum `tbl_order_status_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `tbl_order_status` MODIFY `status` ENUM('CANCELLED', 'APPROVED', 'PAID', 'REFUNDED', 'PLACED_ORDER', 'RATING', 'SHIPPED', 'DELIVERED') NOT NULL;
