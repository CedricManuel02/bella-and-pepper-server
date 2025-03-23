import type { Context } from "hono";
import { createCartService, deleteCartService, getCartService, updateCartService } from "../../services/cart/index.js";
import { StatusCodes } from "http-status-codes";

export async function getCartController(c: Context) {
    const user_id = c.get("user_id");

    const cart = await getCartService(user_id);

    return c.json({cart, status: StatusCodes.ACCEPTED});
}

export async function deleteCartController(c: Context) {
    const user_id = c.get("user_id");
    
    const {cart_id} = await c.req.param();

    await deleteCartService(cart_id, user_id);

    return c.json({message: "Successfully deleted cart", status: StatusCodes.OK});
}

export async function updateCartController(c: Context) {
    const user_id = c.get("user_id");
    const body = await c.req.json();

    const {cart_id} = await c.req.param();

    await updateCartService(cart_id, body.item_quantity, user_id, body.action)

    return c.json({message: "Successfully updated cart", status: StatusCodes.OK});
}

export async function createCartController(c: Context) {
    const body = await c.req.json();
    
    const user_id = c.get("user_id");

    const payload = {
        user_id,
        product_id: body.product_id,
        variant_id: body.selected_variant_id,
        item_quantity: body.item_quantity,
    }
    
    await createCartService(payload);

    return c.json({message: "Successfully added to cart", status: StatusCodes.CREATED});
}