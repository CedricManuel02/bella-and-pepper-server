import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { createRatingService } from "../../services/rating/index.js";

export async function createRatingController(c: Context) {
  const { variant_id , order_id, user_id}= await c.req.param();

  const body = await c.req.parseBody();

  await createRatingService({variant_id: variant_id, order_id: order_id, user_id: user_id, rating: body})

  return c.json({
    message: "Successfully created rating",
    status: StatusCodes.CREATED,
  });
}
