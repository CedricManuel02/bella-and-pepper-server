import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { createCheckoutService } from "../../services/checkout/index.js";

export default async function createCheckoutController (c: Context) {
    const body = await c.req.json();

    const {user_id} = await c.req.param();

    const url = await createCheckoutService(body, user_id);
    
    return c.json({checkout_url: url, success: StatusCodes.CREATED});
}


