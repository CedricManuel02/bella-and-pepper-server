import { PrismaClient } from "@prisma/client";
import type { IDeliveryDetails } from "../../interfaces/interface.js";

const prisma = new PrismaClient();

export async function createDeliveryData(payload: {delivery_details: IDeliveryDetails;}) {
  const delivery = await prisma.tbl_delivery_information.create({
    data: {
      order_id: payload.delivery_details.order_id,
      delivery_company: payload.delivery_details.delivery_company,
      delivery_rider_name: payload.delivery_details.delivery_rider_name,
      delivery_rider_phone: payload.delivery_details.delivery_rider_phone,
      delivery_plate_number: payload.delivery_details.delivery_plate_number,
      delivery_tracking_number:
        payload.delivery_details.delivery_tracking_number,
    },
  });
  return delivery;
}
