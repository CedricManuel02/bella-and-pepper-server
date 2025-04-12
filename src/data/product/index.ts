import { PrismaClient } from "@prisma/client";
import type { IProduct, IUpdateProduct } from "../../interfaces/interface.js";

const prisma = new PrismaClient();
// GET ALL THE PRODUCTS (PUBLIC)
export async function getProductsData() {
  const products = await prisma.tbl_products.findMany({
    include: {
      tbl_categories: true,
      tbl_variants: {
        include: {
          tbl_variant_item: {
            include: {
              tbl_discount: true,
            },
          },
          tbl_rating: true,
        },
      },
      tbl_rating: true,
    },
    orderBy: {
      product_name: "desc"
    }
  });

  return products;
}

// GET SINGLE PRODUCT DATA AND SAVE TO DATABASE (PUBLIC)
export async function getProductData(product_id: string) {
  const product = await prisma.tbl_products.findFirst({
    where: { product_id: product_id },
    include: {
      tbl_variants: {
        include: {
          tbl_variant_item: {
            include: {
              tbl_discount: true,
            },
          },
        },
      },
      tbl_categories: true,
      tbl_rating: {
       include: {
        tbl_orders: true,
        tbl_rating_media: true,
        tbl_users: true,
        tbl_variants: true,
       }
      },
      tbl_items: true,
    },
  });

  return product;
}

// CREATE PRODUCT DATA AND SAVE TO DATABASE
export async function createProductData(payload: IProduct) {
  const product = await prisma.tbl_products.create({
    data: {
      category_id: payload.category_id,
      product_upc_number: payload.product_upc_number,
      product_name: payload.product_name,
      product_description: payload.product_description,
      tbl_variants: {
        create: payload.tbl_variants.map((variant) => ({
          variant_name: variant.variant_name,
          variant_price: Number(variant.variant_price),
          variant_stocks: Number(variant.variant_stocks),
          variant_image_url: variant.variant_image_url,
        })),
      },
    },
  });

  return product;
}

// DELETE PRODUCT DATA FROM THE DATABASE
export async function deleteProductData(product_id: string) {
  const product = await prisma.tbl_products.update({
    data: { product_date_deleted: new Date() },
    where: { product_id: product_id },
  });

  return product;
}
export async function retrieveProductData(product_id: string) {
  const product = await prisma.tbl_products.update({
    data: { product_date_deleted: null },
    where: { product_id: product_id },
  });

  return product;
}
export async function updateProductData(payload: {
  product_id: string;
  product_data: IUpdateProduct;
}) {
  const product = await prisma.tbl_products.update({
    data: {
      category_id: payload.product_data.category_id,
      product_upc_number: payload.product_data.product_upc_number,
      product_name: payload.product_data.product_name,
      product_description: payload.product_data.product_description,
    },
    where: { product_id: payload.product_id },
  });

  return product;
}

// TODO: FIX THE UI FOR THE PRODUCT ADMIN AND REFRACTOR
