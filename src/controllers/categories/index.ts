import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { getCategoriesData } from "../../data/categories/indext.js";
import { createCategoryService, deleteCategoryService, getCategoryService, retrieveCategoryService, updateCategoryService } from "../../services/categories/index.js";

// Get all categories without Authentication
export async function getCategoriesController(c: Context) {

    const categoriesData = await getCategoriesData();

    return c.json({ category: categoriesData, status: StatusCodes.OK});
}
// Get Single Category with Authentication
export async function getCategoryController(c: Context) {

    const {category_id} = await c.req.param();

    const categoryData = await getCategoryService({ category_id } );
    
    return c.json({category: categoryData, status: StatusCodes.OK})

}

// Create Category Controller with Authentication
export async function createCategoryController(c: Context) {
    const body = await c.req.parseBody();

    const data = {
        "category_name": body["category_name"] as string,
        "category_image": body["category_image"] as File
    }
    
    await createCategoryService(data);

    return c.json({ message: "Successfully created category", status: StatusCodes.CREATED});
}

export async function deleteCategoryController(c: Context) { 
    const {category_id} = await c.req.param();

    await deleteCategoryService({category_id});

    return c.json({ message: "Successfully deleted category", status: StatusCodes.OK});

}

export async function retrieveCategoryController(c: Context) { 
    const {category_id} = await c.req.param();

    await retrieveCategoryService({category_id});

    return c.json({ message: "Successfully retrieve category", status: StatusCodes.OK});

}
// Updating the category using PUT Request
export async function updateCategoryController(c: Context) { 
    const body = await c.req.parseBody();

    const {category_id} = await c.req.param();
    
    const payload = {
        category_id: category_id,
        category_name: body["category_name"] as string,
        category_image: body["category_image"] as File
    };

    await updateCategoryService(payload);

    return c.json({ message: "Successfully updated category", status: StatusCodes.CREATED});

}