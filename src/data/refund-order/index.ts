import { PrismaClient, RefundReason } from "@prisma/client";

const prisma = new PrismaClient();
export async function createOrderRefundData({payment_id, amount, notes, reason} : {payment_id: string, amount: number, notes: string, reason: RefundReason}){
    const cancelled = await prisma.tbl_order_refund.create({
        data: {
            payment_id: payment_id,
            payment_refunded_amount: amount,
            payment_refunded_notes: notes,
            payment_refunded_reason: reason,
        }
    });

    return cancelled;
}