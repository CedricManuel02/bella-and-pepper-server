import {
  createCartData,
  deleteCartData,
  getCartByVariantIdData,
  getCartData,
  getCartsData,
  getExistingCartData,
  updateCartData,
} from "../../data/cart/index.js";
import { BadRequestError } from "../../utils/error.js";
import { isUserExistingService } from "../user/index.js";
import { getProductData } from "../../data/product/index.js";
import { getVariantData } from "../../data/variant/index.js";
import type { TAccountUserID } from "../../types/account.types.js";
import type { TCartByVariantID, TCartCreate, TCartDelete, TCartID, TCartIsExisting, TCartUpdateAction } from "../../types/cart.types.js";

// GET CART SERVICE
export async function getCartService({ user_id }: TAccountUserID) {
  try {
    await isUserExistingService({ user_id });

    const cart = await getCartsData({ user_id });

    return cart;
  } catch (error) {
    console.error("Error getting cart service:", error);
    throw new BadRequestError("Unable to get the cart list service");
  }
}
// CREATE CART SERVICE
export async function createCartService({ product_id, user_id, variant_id, item_quantity }: TCartCreate) {
  try {
    if (!product_id || !user_id || !variant_id || !item_quantity || item_quantity <= 0) {
      throw new BadRequestError("All fields is required");
    }

    await isUserExistingService({ user_id });

    const product = await getProductData(product_id);

    if (!product) throw new BadRequestError("Product not found");

    const variant = await getVariantData(variant_id);

    if (!variant) throw new BadRequestError("Variant not found");

    if (product.product_id !== variant.product_id) throw new BadRequestError("Invalid selection of products");

    if (item_quantity > variant.variant_stocks) throw new BadRequestError("Out of stock for this variant");

    const cart = await getExistingCartData({ user_id, variant_id });

    if (cart) {
      item_quantity += cart.cart_item_quantity;

      const updatedCart = await updateCartService({ cart_id: cart.cart_id, item_quantity, user_id, action: "INCREMENT" });

      return updatedCart;
    }

    const createCart = await createCartData({ product_id, user_id, variant_id, item_quantity });

    return createCart;
  } catch (error) {
    console.error("Error to create cart service:", error);
    throw new BadRequestError("Unable to create cart service");
  }
}
// UPDATE CART SERVICE
export async function updateCartService({ cart_id, item_quantity, user_id, action }: TCartUpdateAction) {
  try {
    if (!cart_id) throw new BadRequestError("Cart ID is required");

    const cart = await isCartExisting({ cart_id, user_id });

    if (cart.tbl_products.product_date_deleted !== null) {
      throw new BadRequestError("Sorry, this product is not available right now");
    }

    if (item_quantity < 1) throw new BadRequestError("Invalid quantity. Must be at least 1.");

    if (item_quantity > cart.tbl_variants.variant_stocks) {
      throw new BadRequestError("Not enough stock available for this variant. Check your cart quantity.");
    }

    let updatedQuantity = cart.cart_item_quantity;

    switch (action) {
      case "INCREMENT":
        if (updatedQuantity < cart.tbl_variants.variant_stocks) {
          updatedQuantity += 1;
        }
        break;
      case "DECREMENT":
        if (updatedQuantity > 1) {
          updatedQuantity -= 1;
        }
        break;
      default:
        throw new BadRequestError("Invalid action.");
    }

    const updateCart = await updateCartData({ cart_id: cart.cart_id, item_quantity: updatedQuantity });

    if (!updateCart) throw new BadRequestError("Failed to update cart.");

    return updateCart;
  } catch (error) {
    console.error("Error to update cart service:", error);
    throw new BadRequestError("Unable to update cart service");
  }
}
// DELETE CART SERVICE
export async function deleteCartService({ cart_id, user_id }: TCartDelete) {
  try {
    if (!cart_id) throw new BadRequestError("Cart ID is required");

    await isCartExisting({ cart_id, user_id });

    const deleteCart = await deleteCartData({ cart_id, user_id });

    if (!deleteCart) throw new BadRequestError("Failed to delete cart");

    return deleteCart;
  } catch (error) {
    console.error("Error to delete cart service:", error);
    throw new BadRequestError("Unable to delete cart service");
  }
}
// DELETE CART BY VARIANY ID SERVICE
export async function deleteCartByVariantIdService({ variant, user_id }: TCartByVariantID) {
  try {
    if (!variant || variant.length === 0 || !user_id) {
      throw new BadRequestError("Field is required");
    }

    await isUserExistingService({ user_id });

    const deletedCarts: string[] = [];

    for (let i = 0; i < variant.length; i++) {
      const variant_id = variant[i].variant_id;

      const cart = await getCartByVariantIdData({ variant_id, user_id });

      if (cart) {
        const deleteCartResult = await deleteCartData({ cart_id: cart.cart_id, user_id: cart.user_id });

        if (!deleteCartResult) {
          throw new BadRequestError(`Failed to delete cart for variant_id ${variant_id}`);
        }
        deletedCarts.push(cart.cart_id);
      }
    }

    return deletedCarts;
  } catch (error) {
    console.error("Error to delete cart by variant id service:", error);
    throw new BadRequestError("Unable to delete cart by variant id service");
  }
}
// CHECK IF THE CART IS EXISTING
async function isCartExisting({ cart_id, user_id }: TCartIsExisting) {
  const cart = await getCartData({ cart_id, user_id });

  if (!cart) throw new BadRequestError("Cart not found");

  return cart;
}
