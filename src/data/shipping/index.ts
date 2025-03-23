import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function getShippingFeeData(payload: {province_id: string}){
    const shipping = prisma.tbl_shipping_fee.findFirst({
        where: {province_id: payload.province_id}
    });

    return shipping;
}

export async function getShippingData(payload: {province: string}){
    const shipping = prisma.tbl_shipping_fee.findFirst({
        where: {province_name: payload.province}
    });

    return shipping;
}