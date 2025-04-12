import {
  createCartData,
  deleteCartData,
  getCartByVariantIdData,
  getCartData,
  getCartsData,
  getExistingCartData,
  updateCartData,
} from "../../data/cart/index.js";
import { getProductData } from "../../data/product/index.js";
import { getUserData } from "../../data/user/index.js";
import { getVariantData } from "../../data/variant/index.js";
import { BadRequestError } from "../../utils/error.js";

export async function getCartService(user_id: string) {
  const user = await getUserData(user_id);

  if (!user) throw new BadRequestError("User not found");

  const cart = await getCartsData({ user_id: user?.user_id });

  return cart;
}

export async function createCartService(payload: { product_id: string; user_id: string; variant_id: string; item_quantity: number }) {
  if (!payload.product_id || !payload.user_id || !payload.variant_id || !payload.item_quantity || payload.item_quantity <= 0) {
    throw new BadRequestError("All fields is required");
  }

  const user = await getUserData(payload.user_id);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const product = await getProductData(payload.product_id);

  if (!product) {
    throw new BadRequestError("Product not found");
  }

  const variant = await getVariantData(payload.variant_id);

  if (!variant) {
    throw new BadRequestError("Variant not found");
  }

  if (product.product_id !== variant.product_id) {
    throw new BadRequestError("Invalid product for variant");
  }

  if (payload.item_quantity > variant.variant_stocks) {
    throw new BadRequestError("Out of stock for this variant");
  }

  const cart = await getExistingCartData({ user_id: payload.user_id, variant_id: payload.variant_id });

  if (cart) {
    payload.item_quantity += cart.cart_item_quantity;
    const updateCart = await updateCartService(cart.cart_id, payload.item_quantity, payload.user_id, "INCREMENT");
    return updateCart;
  }

  const createCart = await createCartData(payload);
  return createCart;
}

export async function updateCartService(cart_id: string, item_quantity: number, user_id: string, action: string) {
  if (!cart_id) {
    throw new BadRequestError("Cart ID is required");
  }

  const cart = await getCartData(cart_id, user_id);

  if (!cart) {
    throw new BadRequestError("Cart not found");
  }

  if (cart.tbl_products.product_date_deleted !== null) {
    throw new BadRequestError("Sorry, this product is not available right now");
  }

  if (item_quantity < 1) {
    throw new BadRequestError("Invalid quantity. Must be at least 1.");
  }

  if (item_quantity > cart.tbl_variants.variant_stocks) {
    throw new BadRequestError("Not enough stock available for this variant. Check your cart quantity.");
  }

  let updated_quantity = cart.cart_item_quantity;

  switch (action) {
    case "INCREMENT":
      if (updated_quantity < cart.tbl_variants.variant_stocks) {
        updated_quantity += 1;
      }
      break;
    case "DECREMENT":
      if (updated_quantity > 1) {
        updated_quantity -= 1;
      }
      break;
    default:
      throw new BadRequestError("Invalid action.");
  }

  const updateCart = await updateCartData({ cart_id: cart.cart_id, item_quantity: updated_quantity });

  if (!updateCart) {
    throw new BadRequestError("Failed to update cart.");
  }

  return updateCart;
}

export async function deleteCartService(cart_id: string, user_id: string) {
  if (!cart_id) {
    throw new BadRequestError("Cart ID is required");
  }

  const cart = await getCartData(cart_id, user_id);

  if (!cart) {
    throw new BadRequestError("Cart not found");
  }

  const deleteCart = await deleteCartData({ cart_id, user_id });

  if (!deleteCart) {
    throw new BadRequestError("Failed to delete cart");
  }

  return cart;
}

export async function deleteCartByVariantIdService(payload: { variant: any; user_id: string }) {
  if (!payload.variant || payload.variant.length === 0 || !payload.user_id) {
    throw new BadRequestError("Field is required");
  }

  const user = await getUserData(payload.user_id);
  if (!user) {
    throw new BadRequestError("User not found");
  }

  // Array to store deleted cart IDs
  const deletedCarts: string[] = [];

  for (let i = 0; i < payload.variant.length; i++) {
    const variant = payload.variant[i];
    const cart = await getCartByVariantIdData({ variant_id: variant.variant_id, user_id: payload.user_id });

    if (cart) {
      const deleteCartResult = await deleteCartData({ cart_id: cart.cart_id, user_id: cart.user_id });

      if (!deleteCartResult) {
        throw new BadRequestError(`Failed to delete cart for variant_id: ${variant.variant_id}`);
      }
      deletedCarts.push(cart.cart_id);
    }
  }

  return deletedCarts;
}
