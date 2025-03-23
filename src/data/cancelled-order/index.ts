import { CancelledReason, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function createCancelledOrderData({order_id, reason} : {order_id: string, reason: CancelledReason}){
    const cancelled = await prisma.tbl_cancelled_order.create({
        data: {
            order_id: order_id,
            cancelled_reason: reason,
        }
    });

    return cancelled;
}