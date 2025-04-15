import { BadRequestError } from "../../utils/error.js";
import { createFileService, deleteFileService, formatFileService, validateFileService } from "../file/index.js";
import { createCategoryData, deleteCategoryData, getCategoryData, retrieveCategoryData, updateCategoryData } from "../../data/categories/indext.js";
import type { TCategoryCreateService, TCategoryID, TCategoryUpdateService } from "../../types/category.types.js";
import { CreateCloudinaryImage, DeleteCloudinaryImage } from "../../utils/helper.js";
import { CATEGORY_FOLDER_NAME } from "../../constant/constant.js";

// GET A SINGLE CATEGORY SERVICE
export async function getCategoryService({ category_id }: TCategoryID) {
  try {
    if (!category_id) throw new BadRequestError("Invalid Category ID");

    const category = await getCategoryData({ category_id });

    if (!category) throw new BadRequestError("Category not found");

    return category;
  } catch (error) {
    console.error("Error getting category service:", error);
    throw new BadRequestError("Unable to get category");
  }
}
// CREATE CATEGORY SERVICE
export async function createCategoryService({ category_name, category_image }: TCategoryCreateService) {
  try {
    if (!category_name || !category_image) throw new BadRequestError("All fields are required");

    const { url } = await CreateCloudinaryImage({ image: category_image, folder_name: CATEGORY_FOLDER_NAME });

    const category = await createCategoryData({
      category_name,
      category_image_url: url,
    });

    if (!category) throw new BadRequestError("Failed to create category");

    return category;
  } catch (error) {
    console.error("Error to create category service:", error);
    throw new BadRequestError("Unable to create category");
  }
}
// DELETE CATEGORY SERVICE
export async function deleteCategoryService({ category_id }: TCategoryID) {
  try {
    if (!category_id) throw new BadRequestError("Category id is required");

    await getCategoryService({category_id});

    const category = await deleteCategoryData({ category_id });

    if (!category) throw new BadRequestError("Failed to delete category");

    return category;
  } catch (error) {
    console.error("Error deleting category service:", error);
    throw new BadRequestError("Unable to delete category");
  }
}
// RETRIEVE CATEGORY SERVICE
export async function retrieveCategoryService({ category_id }: TCategoryID) {
  try {
    if (!category_id) throw new BadRequestError("Category id is required");

    await getCategoryService({category_id});

    const category = await retrieveCategoryData({ category_id });

    if (!category) throw new BadRequestError("Failed to retrieve category");

    return category;
  } catch (error) {
    console.error("Error retrieving category service:", error);
    throw new BadRequestError("Unable to retrieve category");
  }
}
// UPDATE CATEGORY SERVICE
export async function updateCategoryService({ category_id, category_name, category_image} : TCategoryUpdateService) {
  try {
    let uploadFile;

    if (!category_name || !category_id) throw new BadRequestError("All fields are required");

    const category = await getCategoryService({category_id});
    
    if (category_image) {
      await DeleteCloudinaryImage({image: category.category_image_url, folder_name: CATEGORY_FOLDER_NAME})
      uploadFile = await CreateCloudinaryImage({image: category_image, folder_name: CATEGORY_FOLDER_NAME});
    }
  
    const category_image_url =  uploadFile ? uploadFile.url : null;
  
    const updateCategory = await updateCategoryData({category_id, category_name, category_image_url});
  
    if (!updateCategory) throw new BadRequestError("Failed to create category");
  
    return updateCategory;
  } catch (error) {
    console.error("Error to update category service:", error);
    throw new BadRequestError("Unable to update category service");
  }
}


