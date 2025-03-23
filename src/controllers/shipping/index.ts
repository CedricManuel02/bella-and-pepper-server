import type { Context } from "hono";
import { getShippingService } from "../../services/shipping/index.js";
import { StatusCodes } from "http-status-codes";

export async function getShippingController(c: Context) {
  const { province_id } = c.req.param();

  const shipping= await getShippingService({ province_id });
  
  return c.json({ shipping_rate: shipping.shipping_fee_rate, shipping_days: shipping.expected_shipping_days, status: StatusCodes.OK });
}
