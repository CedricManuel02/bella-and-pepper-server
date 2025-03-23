import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// GET ALL VARIANT
export async function getVariantsData(product_id: string) {
  const variant = await prisma.tbl_variants.findMany({
    where: { product_id: product_id, variant_date_deleted: null },
  });

  return variant;
}
// GET VARIANT DATA
export async function getVariantData(variant_id: string) {
    const variant = await prisma.tbl_variants.findFirst({
      where: { variant_id: variant_id },
    });
  
    return variant;
  }
// CREATE VARIANT DATA
export async function createVariantData(payload: {variant_data: any}) {
  const variant = await prisma.tbl_variants.create({
    data: payload.variant_data,
  });

  return variant;
}
// DELETE VARIANT DATA
export async function deleteVariantData(variant_id: string) {
  const variant = await prisma.tbl_variants.update({
    data: {
      variant_date_deleted: new Date(),
    },
    where: { variant_id: variant_id },
  });

  return variant;
}
// UPDATE VARIANT DATA
export async function updateVariantData(payload: {variant_id: string, variant_data: any}) {
  const variant = await prisma.tbl_variants.update({
    data: payload.variant_data,
    where: { variant_id: payload.variant_id },
  });

  return variant;
}
// RETRIEVE VARIANT DATA
export async function retrieveVariantData(variant_id: string) {
  const variant = await prisma.tbl_variants.update({
    data: { variant_date_deleted: null },
    where: { variant_id: variant_id },
  });

  return variant;
}

export async function updateVariantStockData(payload: {variant_id: string, variant_stock: number}) {
  const variant = await prisma.tbl_variants.update({
    data: {
      variant_stocks: payload.variant_stock
    },
    where: { variant_id: payload.variant_id },
  });

  return variant;
}
