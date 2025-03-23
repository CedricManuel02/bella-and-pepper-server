import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { getProductsData } from "../../data/product/index.js";
import { createProductService, deleteProductService, getProductService, retrieveProductService, updateProductService } from "../../services/product/index.js";

export async function getProductsController(c: Context){
    
   const product = await getProductsData();

   return c.json({data: product, status: StatusCodes.ACCEPTED})
}

export async function getProductController(c: Context) {
    const {product_id} = await c.req.param();

    const product = await getProductService(product_id);

    return c.json({data: product, status: StatusCodes.ACCEPTED});
}

export async function createProductController(c: Context) {
    const body = await c.req.parseBody();
    
    createProductService(body);
  
    return c.json({ message: "Successfully created product", status: StatusCodes.CREATED });
}

export async function deleteProductController(c: Context) {
    const {product_id} = await c.req.param();

    await deleteProductService(product_id);
    
    return c.json({message: "Successfully delete product", status: StatusCodes.ACCEPTED});
}

export async function retrieveProductController(c: Context){
    const {product_id} = await c.req.param();

    await retrieveProductService(product_id);
    
    return c.json({message: "Successfully retrieve product", status: StatusCodes.ACCEPTED});
}

export async function updateProductController(c: Context) {
    const body = await c.req.json();

    const { product_id } = c.req.param();

    updateProductService({product_id: product_id, product_data: body});
  
    return c.json({ message: "Successfully updated product", status: StatusCodes.CREATED });
}