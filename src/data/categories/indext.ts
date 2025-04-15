import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../../utils/error.js";
import type { TCategoryCreate, TCategoryID, TCategoryUpdate } from "../../types/category.types.js";
const prisma = new PrismaClient();

// GET ALL CATEGORY DATA FROM THE DATABASE
export async function getCategoriesData() {
  try {
    const categories = await prisma.tbl_categories.findMany({ orderBy: { category_date_created: "desc" } });
    return categories;
  } catch (error) {
    console.error("Error getting categories data:", error);
    throw new BadRequestError("Unable to get categories");
  }
}
// GET SINGLE CATEGORY DATA FROM THE DATABASE
export async function getCategoryData({ category_id }: TCategoryID) {
  try {
    const category = await prisma.tbl_categories.findUnique({ where: { category_id } });
    return category;
  } catch (error) {
    console.error("Error getting category data:", error);
    throw new BadRequestError("Unable to get category");
  }
}
// CREATE CATEGORY DATA FROM THE DATABASE
export async function createCategoryData({ category_name, category_image_url }: TCategoryCreate) {
  try {
    const category = await prisma.tbl_categories.create({ data: { category_name, category_image_url } });
    return category;
  } catch (error) {
    console.error("Error creating category data:", error);
    throw new BadRequestError("Unable to create category");
  }
}
// DELETE CATEGORY DATA FROM THE DATABASE
export async function deleteCategoryData({ category_id } : TCategoryID) {
  try {
    const category = await prisma.tbl_categories.update({
      data: { category_date_deleted: new Date() },
      where: { category_id },
    });
  
    return category;
  }
  catch (error) {
    console.error("Error deleting category data:", error);
    throw new BadRequestError("Unable to delete category");
  }
}

// RETRIEVE THE CATEGORY DATA FROM THE DATABASE
export async function retrieveCategoryData({ category_id } : TCategoryID) {
  try {
    const category = await prisma.tbl_categories.update({
      data: { category_date_deleted: null },
      where: { category_id },
    });
  
    return category;
  }
  catch (error) {
    console.error("Error retrieving category data:", error);
    throw new BadRequestError("Unable to retrieve category");
  }
}

// UPDATE THE CATEGORY DATA FROM THE DATABASE
export async function updateCategoryData({category_id, category_name, category_image_url} : TCategoryUpdate) {
 try {
  const updateData: Record<string, any> = { category_name };

  if (category_image_url) updateData.category_image_url = category_image_url;
  
  const category = await prisma.tbl_categories.update({
    data: updateData,
    where: { category_id },
  });

  return category;
 } catch (error) {
  console.error("Error updating category data:", error);
  throw new BadRequestError("Unable to update category data");
 }
}
