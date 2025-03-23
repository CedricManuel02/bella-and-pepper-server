import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function createShippedOrderImageData(payload: {order_status_id: string, order_status_image: string}){
    const shipping = prisma.tbl_order_status_images.create({
        data: {
        order_status_id: payload.order_status_id,
        order_status_image: payload.order_status_image
        }
    });

    return shipping;
}