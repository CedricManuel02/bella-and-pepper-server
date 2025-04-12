import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createRatingProductImageData(payload: { rating_id: string; media_path: string }) {
  const rating = await prisma.tbl_rating_media.create({
    data: {
      rating_id: payload.rating_id,
      media_path: payload.media_path,
    },
  });

  return rating;
}

export async function createRatingProductData(payload: {
  order_rating: string;
  order_rating_text: string;
  product_id: string;
  variant_id: string;
  order_id: string;
  user_id: string;
}) {
  const rating = await prisma.tbl_rating.create({
    data: {
      order_id: payload.order_id,
      user_id: payload.user_id,
      product_id: payload.product_id,
      variant_id: payload.variant_id,
      rating: Number(payload.order_rating),
      rating_text: payload.order_rating_text,
    },
  });

  return rating;
}

export async function getRatingData({ rating_id }: { rating_id: string }) {
  const rating = await prisma.tbl_rating.findFirst({
    where: {
      rating_id,
    },
  });

  return rating;
}

export async function deleteRatingData({ rating_id }: { rating_id: string }) {
  const rating = await prisma.tbl_rating.update({
    data: {
      rating_date_deleted: new Date(),
    },
    where: {
      rating_id,
    },
  });
  return rating;
}
