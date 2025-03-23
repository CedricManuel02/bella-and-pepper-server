import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function getCartsData(payload: {user_id: string;}){
    const cart = await prisma.tbl_cart.findMany({where: {user_id: payload.user_id}, include: {
        tbl_products: true,
        tbl_variants: {
            include: {
                tbl_variant_item: {
                    include: {
                        tbl_discount: true
                    }
                }
            }
        },
    }});

    return cart;
}

export async function getCartData(cart_id: string, user_id: string){
    const cart = await prisma.tbl_cart.findUnique({where: {cart_id: cart_id}, include: {tbl_variants: true, tbl_products: true}});

    return cart; 
}
// GET EXISTING CART DATA
export async function getExistingCartData(payload: {user_id: string, variant_id: string}){
    const cart = await prisma.tbl_cart.findFirst({where: {user_id: payload.user_id, variant_id: payload.variant_id}});

    return cart; 
}
// CREATE CART DATA

export async function createCartData(payload: { user_id: string, product_id: string, variant_id: string, item_quantity: number}) {
    const cart = await prisma.tbl_cart.create({data: {
        user_id: payload.user_id,
        product_id: payload.product_id,
        variant_id: payload.variant_id,
        cart_item_quantity: payload.item_quantity
    }});

    return cart; 
}

// UPDATE CART DATA

export async function updateCartData(payload: {cart_id: string, item_quantity: number}){
    const cart = await prisma.tbl_cart.update({
        data: {
            cart_item_quantity: payload.item_quantity,
            cart_date_updated: new Date(),
        },
        where: {
            cart_id: payload.cart_id
        }
    });

    return cart;
}
// DELETE CART DATA

export async function deleteCartData(payload: {cart_id: string, user_id: string}) {
    const cart = await prisma.tbl_cart.delete({where: {
        cart_id: payload.cart_id,
        user_id: payload.user_id
    }});
    return cart;
}

export async function getCartByVariantIdData(payload: {variant_id: string, user_id: string}){
    const cart = await prisma.tbl_cart.findFirst({where: {variant_id: payload.variant_id, user_id: payload.user_id}, include: {tbl_variants: true, tbl_products: true}});

    return cart; 
}