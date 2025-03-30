import { createProductData, deleteProductData, getProductData, retrieveProductData, updateProductData } from "../../data/product/index.js";
import { BadRequestError } from "../../utils/error.js";
import { createFileService } from "../file/index.js";

// GET SINGLE PRODUCT SERVICE
export async function getProductService(product_id: string) {

  if (!product_id) {
    throw new Error("Product ID is required");
  }
  const product = await getProductData(product_id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}
// CREATE THE PRODUCT SERVICE
export async function createProductService(payload: any) {
  const variant_parse = JSON.parse(payload.variants);

  if (!payload.product_upc || !payload.product_name || !payload.product_description || !payload.product_category || variant_parse.length === 0) {
    throw new BadRequestError("All fields are required.");
  }

  // Process variants and upload images to Cloudinary
  for (let index = 0; index < variant_parse.length; index++) {

      const variant = variant_parse[index];

      const imageKey = `variant_image[${index}]`;

      if(typeof Number(variant.variant_price) !== "number"){
        throw new BadRequestError("Price must be a number");
      }

      if(typeof Number(variant.variant_stocks) !== "number"){
        throw new BadRequestError("Stocks must be a number");
      }

      // After all the validation it will upload the variant to Cloudinary
      if (payload[imageKey]) {

        const imageFile = payload[imageKey];
     
        const file = await createFileService({image: imageFile, folder_name: "products"});

        if(!file){
          throw new BadRequestError("Failed to upload the variant image from Cloudinary");
        }

        variant.variant_image_url = file.url;
       
      }
  }

  const _payload = {
    category_id: payload.product_category,
    product_upc_number: payload.product_upc,
    product_name: payload.product_name,
    product_description: payload.product_description,
    tbl_variants: variant_parse
  }

  // UPLOAD THE PRODUCT TO THE DATABASE

  const productData = await createProductData(_payload);

  if(!productData){
    throw new BadRequestError("Failed to upload the product");
  }

  return productData;
}
// DELETE THE PRODUCT SERVICE
export async function deleteProductService(product_id: string){
  if(!product_id){
    throw new BadRequestError("Product ID is required");
  }

  const product = await getProductData(product_id);

  if(!product){
    throw new BadRequestError("Product not found");
  }

  const deleteProduct = await deleteProductData(product_id);

  if(!deleteProduct){
    throw new BadRequestError("Failed to delete the product");
  }

  return deleteProduct;
}
export async function retrieveProductService(product_id: string){
  if(!product_id){
    throw new BadRequestError("Product ID is required");
  }

  const product = await getProductData(product_id);

  if(!product){
    throw new BadRequestError("Product not found");
  }

  const retrieveProduct = await retrieveProductData(product_id);

  if(!retrieveProduct){
    throw new BadRequestError("Failed to delete the product");
  }

  return retrieveProduct;
}
// UPDATE THE PRODUCT SERVICE
export async function updateProductService(payload: {product_id: string, product_data: any}) {
  if (!payload.product_id || !payload.product_data.product_upc_number || !payload.product_data.product_name || !payload.product_data.product_description || !payload.product_data.category_id) {
    throw new BadRequestError("All fields are required.");
  }

  const product = await getProductData(payload.product_id);

  if(!product){
    throw new BadRequestError("Product not found");
  }

  const updateProduct = await updateProductData(payload);
  
  if(!updateProduct){
    throw new BadRequestError("Failed to update product");
  }

  return updateProduct;
}