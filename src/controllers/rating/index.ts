import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { createRatingService, deleteRatingService } from "../../services/rating/index.js";

export async function createRatingController(c: Context) {

  const { variant_id , order_id}= await c.req.param();

  const body = await c.req.parseBody();

  await createRatingService({variant_id: variant_id, order_id: order_id,  rating: body})

  return c.json({
    message: "Successfully created rating",
    status: StatusCodes.CREATED,
  });
}

// DELETING RATING IN PRODUCT 

export async function deleteRatingController(c: Context) {
  const user_id = c.get("user_id");
  const {rating_id} = await c.req.param();

  await deleteRatingService({rating_id, user_id});

  return c.json({message: "Successfully deleted rating", status: StatusCodes.OK});
}