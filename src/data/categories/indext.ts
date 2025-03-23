import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET ALL CATEGORY DATA FROM THE DATABASE
export async function getCategoriesData() {
  const categories = await prisma.tbl_categories.findMany({orderBy: {category_date_created: "desc"}});

  return categories;
}

// GET SINGLE CATEGORY DATA FROM THE DATABASE
export async function getCategoryData(payload: { category_id: string }) {
  const category = await prisma.tbl_categories.findUnique({
    where: { category_id: payload.category_id },
  });

  return category;
}

// CREATE CATEGORY DATA FROM THE DATABASE
export async function createCategoryData(payload: {
  category_name: string;
  category_image_url: string;
}) {
  const category = await prisma.tbl_categories.create({
    data: {
      category_name: payload.category_name,
      category_image_url: payload.category_image_url,
    },
  });

  return category;
}

// DELETE CATEGORY DATA FROM THE DATABASE
export async function deleteCategoryData(payload: { category_id: string }) {
  const category = await prisma.tbl_categories.update({
    data: { category_date_deleted: new Date() },
    where: { category_id: payload.category_id },
  });

  return category;
}

// RETRIEVE THE CATEGORY DATA FROM THE DATABASE
export async function retrieveCategoryData(payload: { category_id: string }) {
  const category = await prisma.tbl_categories.update({
    data: { category_date_deleted: null },
    where: { category_id: payload.category_id },
  });

  return category;
}

// UPDATE THE CATEGORY DATA FROM THE DATABASE
export async function updateCategoryData(payload: { category_id: string; category_name: string; category_image_url?: string | null;}) {
  const updateData: Record<string, any> = { category_name: payload.category_name };

  if (payload.category_image_url) {
    updateData.category_image_url = payload.category_image_url;
  }

  const category = await prisma.tbl_categories.update({
    data: updateData,
    where: { category_id: payload.category_id },
  });

  return category;
}
