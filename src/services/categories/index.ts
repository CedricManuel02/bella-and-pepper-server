import { BadRequestError } from "../../utils/error.js";
import { createFileService, deleteFileService, formatFileService, validateFileService } from "../file/index.js";
import { createCategoryData, deleteCategoryData, getCategoryData, retrieveCategoryData, updateCategoryData } from "../../data/categories/indext.js";


// GET A SINGLE CATEGORY SERVICE
export async function getCategoryService(payload: {category_id: string}) {

    if(!payload.category_id){
        throw new BadRequestError("Invalid Category ID");
    }
     
    const category = await getCategoryData(payload);

    if(!category) {
        throw new BadRequestError("Category not found");
    }

    return category;
}

// CREATE CATEGORY SERVICE
export async function createCategoryService(payload: {category_name: string, category_image: File}) {

    if(!payload.category_name || !payload.category_image){
        throw new BadRequestError("All fields are required");
    }

    await validateFileService({image: payload.category_image});

    const uploadFile = await createFileService({image: payload.category_image, folder_name: "categories"})

    if(!uploadFile) {
        throw new BadRequestError("Cannot upload file, please try again");
    }

    const _payload = {
        category_name: payload.category_name,
        category_image_url: uploadFile.url,
    }

    const category = await createCategoryData(_payload)

    if(!category){
        throw new BadRequestError("Failed to create category");
    }

    return category;
}

// DELETE CATEGORY SERVICE
export async function deleteCategoryService(payload: {category_id: string}) {

    if(!payload.category_id){
        throw new BadRequestError("Category id is required");
    }

    const category = await deleteCategoryData(payload);

    if(!category){
        throw new BadRequestError("Failed to delete category");
    }

    return category;
}

// RETRIECE CATEGORY SERVICE
export async function retrieveCategoryService(payload: {category_id: string}) {

    if(!payload.category_id){
        throw new BadRequestError("Category id is required");
    }

    const category = await retrieveCategoryData(payload);

    if(!category){
        throw new BadRequestError("Failed to delete category");
    }

    return category;
}

// UPDATE CATEGORY SERVICE
export async function updateCategoryService(payload: {category_id: string, category_name: string, category_image: File}) {
    
    let uploadFile;

    if(!payload.category_name || !payload.category_id){
        throw new BadRequestError("All fields are required");
    }

    const category = await getCategoryData(payload);
    // Check if category exists in the database
    if(!category){
        throw new BadRequestError("Category does not exist");
    }
    // check if image is available
    if(payload.category_image) {

        await validateFileService({image: payload.category_image});

        const image_file_name = await formatFileService({image: category.category_image_url});

        const deleteFile = await deleteFileService({filename: image_file_name, folder_name: "categories"});

        if(!deleteFile){
            throw new BadRequestError("Failed to delete image from cloudinary");
        }

        uploadFile = await createFileService({image: payload.category_image, folder_name: "categories"});

        if(!uploadFile) {
            throw new BadRequestError("Cannot upload file, please try again");
        }
    }

    const _payload = {
        category_id: payload.category_id,
        category_name: payload.category_name,
        category_image_url: uploadFile ? uploadFile.url : null,
        category_image_name: uploadFile ? uploadFile.display_name : null,
    }

    const _category = await updateCategoryData(_payload);

    if(!_category){
        throw new BadRequestError("Failed to create category");
    }

    // If the category is successfully updated then delete it from the cloudinary
    const image_file_name = await formatFileService({image: category.category_image_url});

    const deleteFile = await deleteFileService({filename: image_file_name, folder_name: "categories"});

    if(!deleteFile){
        throw new BadRequestError("Failed to delete image from cloudinary");
    }

    return _category;
}

