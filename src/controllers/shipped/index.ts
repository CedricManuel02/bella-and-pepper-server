import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { createShippedService } from "../../services/shipped/index.js";

export async function createShippedController(c: Context) {
  const { order_number } = c.req.param();

  const user_id = c.get("user_id");
  
  const body = await c.req.parseBody();

  await createShippedService({ order_number, shipped_details: body, user_sender_id: user_id });

  return c.json({ message: "Successfully shipped order", status: StatusCodes.OK });
}
