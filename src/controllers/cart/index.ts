import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../utils/error.js";
import { createCartService, deleteCartService, getCartService, updateCartService } from "../../services/cart/index.js";

// GET ALL CART OF USER CONTROLLER
export async function getCartController(c: Context) {
  try {
    const user_id = c.get("user_id");

    const cart = await getCartService(user_id);

    return c.json({ cart, status: StatusCodes.OK });
  } catch (error) {
    console.error("Error getting cart:", error);
    throw new BadRequestError("Unable to get the cart");
  }
}
// CREATE CART CONTROLLER
export async function createCartController(c: Context) {
  try {
    const user_id = c.get("user_id");

    const body = await c.req.json();

    const { product_id, selected_variant_id, item_quantity } = body;

    await createCartService({
      user_id,
      product_id,
      variant_id: selected_variant_id,
      item_quantity,
    });

    return c.json({ message: "Successfully added to cart", status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Error updating cart:", error);
    throw new BadRequestError("Unable to update the cart");
  }
}
// DELETE CART cONTROLLER
export async function deleteCartController(c: Context) {
  try {
    const user_id = c.get("user_id");

    const { cart_id } = await c.req.param();

    await deleteCartService({ cart_id, user_id });

    return c.json({ message: "Successfully deleted cart", status: StatusCodes.ACCEPTED });
  } catch (error) {
    console.error("Error deleting cart:", error);
    throw new BadRequestError("Unable to delete the cart");
  }
}
// UPDATE CART CONTROLLER (Quantity)
export async function updateCartController(c: Context) {
  try {
    const user_id = c.get("user_id");

    const body = await c.req.json();

    const { cart_id } = await c.req.param();

    const { item_quantity, action } = body;

    await updateCartService({ cart_id, item_quantity, user_id, action });

    return c.json({ message: "Successfully updated cart", status: StatusCodes.OK });
  } catch (error) {
    console.error("Error updating cart:", error);
    throw new BadRequestError("Unable to update the cart");
  }
}
