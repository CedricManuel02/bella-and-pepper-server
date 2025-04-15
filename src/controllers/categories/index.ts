import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { getCategoriesData } from "../../data/categories/indext.js";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoryService,
  retrieveCategoryService,
  updateCategoryService,
} from "../../services/categories/index.js";
import { BadRequestError } from "../../utils/error.js";

// GET ALL CATEGORY WITHOUT AUTHENTICATION CONTROLLER
export async function getCategoriesController(c: Context) {
  try {
    const categoriesData = await getCategoriesData();
    return c.json({ category: categoriesData, status: StatusCodes.OK });
  } catch (error) {
    console.error("Error getting categories controller:", error);
    throw new BadRequestError("Unable to get categories controller");
  }
}
// GET SINGLE CATEGORIES CONTROLLER
export async function getCategoryController(c: Context) {
  try {
    const { category_id } = await c.req.param();

    const categoryData = await getCategoryService({ category_id });

    return c.json({ category: categoryData, status: StatusCodes.OK });
  } catch (error) {
    console.error("Error to get category controller:", error);
    throw new BadRequestError("Unable to get category");
  }
}
// CREATE CATEGORY CONTROLLER
export async function createCategoryController(c: Context) {
  try {
    const body = await c.req.parseBody();

    const category = {
      category_name: body["category_name"] as string,
      category_image: body["category_image"] as File,
    };

    await createCategoryService(category);

    return c.json({ message: "Successfully created category", status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Error to create category controller:", error);
    throw new BadRequestError("Unable to create category");
  }
}
// DELETE CATEGORY CONTROLLER
export async function deleteCategoryController(c: Context) {
  try {
    const { category_id } = await c.req.param();

    await deleteCategoryService({ category_id });

    return c.json({ message: "Successfully deleted category", status: StatusCodes.OK });
  } catch (error) {
    console.error("Error to delete category controller:", error);
    throw new BadRequestError("Unable to delete category");
  }
}
// RETRIEVE CATEGORY CONTROLLER
export async function retrieveCategoryController(c: Context) {
  try {
    const { category_id } = await c.req.param();

    await retrieveCategoryService({ category_id });

    return c.json({ message: "Successfully retrieve category", status: StatusCodes.OK });
  } catch (error) {
    console.error("Error to delete category controller:", error);
    throw new BadRequestError("Unable to delete category");
  }
}
// UPDATE CATEGORY CONTROLLER
export async function updateCategoryController(c: Context) {
  try {
    const body = await c.req.parseBody();

    const { category_id } = await c.req.param();
  
    const category = {
      category_id,
      category_name: body["category_name"] as string,
      category_image: body["category_image"] as File,
    };
  
    await updateCategoryService(category);
  
    return c.json({ message: "Successfully updated category", status: StatusCodes.OK });
  } catch (error) {
    console.error("Error to update category controller:", error);
    throw new BadRequestError("Unable to update category");
  }
}
