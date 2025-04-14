import { PrismaClient } from "@prisma/client";
import type { TAccountUserID } from "../../types/account.types.js";
import { BadRequestError } from "../../utils/error.js";
import type { TCart, TCartCreate, TCartDelete, TCartExisting, TCartID, TCartUpdate, TCartVariantID } from "../../types/cart.types.js";

const prisma = new PrismaClient();
// GET ALL USER CART
export async function getCartsData({ user_id }: TAccountUserID) {
  try {
    const cart = await prisma.tbl_cart.findMany({
      where: { user_id },
      orderBy: { cart_date_created: "desc" },
      include: {
        tbl_products: true,
        tbl_variants: {
          include: {
            tbl_variant_item: {
              include: {
                tbl_discount: true,
              },
            },
          },
        },
      },
    });

    return cart;
  } catch (error) {
    console.error("Error to get cart data:", error);
    throw new BadRequestError("Unable to get cart data");
  }
}
// GET SINGEL CART
export async function getCartData({ cart_id, user_id }: TCart) {
  try {
    const cart = await prisma.tbl_cart.findUnique({ where: { cart_id, user_id }, include: { tbl_variants: true, tbl_products: true } });
    return cart;
  } catch (error) {
    console.error("Error to get cart:", error);
    throw new BadRequestError("Unable to get cart");
  }
}
// GET EXISTING CART DATA
export async function getExistingCartData({ user_id, variant_id }: TCartExisting) {
  try {
    const cart = await prisma.tbl_cart.findFirst({ where: { user_id, variant_id } });
    return cart;
  } catch (error) {
    console.error("Error getting existing cart:", error);
    throw new BadRequestError("Unable to get exisiting cart");
  }
}
// CREATE CART DATA
export async function createCartData({ user_id, product_id, variant_id, item_quantity }: TCartCreate) {
  const cart = await prisma.tbl_cart.create({
    data: {
      user_id,
      product_id,
      variant_id,
      cart_item_quantity: item_quantity,
    },
  });

  return cart;
}
// UPDATE CART DATA
export async function updateCartData({ cart_id, item_quantity }: TCartUpdate) {
  try {
    const cart = await prisma.tbl_cart.update({
      data: { cart_item_quantity: item_quantity },
      where: { cart_id },
    });

    return cart;
  } catch (error) {
    console.error("Error update cart:", error);
    throw new BadRequestError("Unable to update cart");
  }
}
// DELETE CART DATA
export async function deleteCartData({ cart_id, user_id }: TCartDelete) {
  try {
    const cart = await prisma.tbl_cart.delete({
      where: { cart_id, user_id },
    });
    return cart;
  } catch (error) {
    console.error("Error deleting cart:", error);
    throw new BadRequestError("Unable to delete cart");
  }
}
// GET CART BY VARIANT ID DATA
export async function getCartByVariantIdData({ variant_id, user_id }: TCartVariantID) {
  try {
    const cart = await prisma.tbl_cart.findFirst({
      where: { variant_id, user_id },
      include: { tbl_variants: true, tbl_products: true },
    });

    return cart;
  } catch (error) {
    console.error("Error to get cart by variant id:", error);
    throw new BadRequestError("Unable to get cart by variant id");
  }
}
