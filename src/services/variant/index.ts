import { getProductData } from "../../data/product/index.js";
import {
  createVariantData,
  deleteVariantData,
  getVariantData,
  getVariantsData,
  retrieveVariantData,
  updateVariantData,
} from "../../data/variant/index.js";
import { BadRequestError } from "../../utils/error.js";
import { createFileService, deleteFileService, formatFileService, validateFileService } from "../file/index.js";

// CREATE VARIANT SERVICE
export async function createVariantService(payload: {
  product_id: string;
  variant_data: any;
}) {
  if (!payload.product_id || !payload.variant_data.variant_image_url) {
    throw new BadRequestError("All fields are required");
  }

  await validateVariantService(payload.variant_data);

  const product = await getProductData(payload.product_id);

  if (!product) {
    throw new BadRequestError("Product not found");
  }

  await validateFileService({ image: payload.variant_data.variant_image_url });

  const uploadFile = await createFileService({
    image: payload.variant_data.variant_image_url,
    folder_name: "products",
  });

  if (!uploadFile) {
    throw new BadRequestError("Cannot upload file, please try again");
  }

  const _payload: any = {
    product_id: payload.product_id,
    variant_name: payload.variant_data.variant_name,
    variant_image_url: uploadFile.url,
    variant_price: Number(payload.variant_data.variant_price),
    variant_stocks: Number(payload.variant_data.variant_stocks),
  };

  const createVariant = await createVariantData({ variant_data: _payload });

  if (!createVariant) {
    throw new BadRequestError("Failed to create variant");
  }
  return createVariant;
}
// DELETE VARIANT SERVICE
export async function deleteVariantService(variant_id: string) {
  if (!variant_id) {
    throw new BadRequestError("Variant ID is required");
  }

  const variant = await getVariantData(variant_id);

  if (!variant) {
    throw new BadRequestError("Variant not found");
  }

  const product = await getVariantsData(variant.product_id);

  if(product.length <= 1) {
    throw new BadRequestError("Product must have at least one variant");
  }

  const deleteVariant = await deleteVariantData(variant_id);

  if (!deleteVariant) {
    throw new BadRequestError("Failed to delete variant");
  }

  return deleteVariant;
}
// RETRIEVE VARIANT SERVICE
export async function retrieveVariantService(variant_id: string) {
  if (!variant_id) {
    throw new BadRequestError("Variant ID is required");
  }

  const variant = await getVariantData(variant_id);

  if (!variant) {
    throw new BadRequestError("Variant not found");
  }

  const retrieveVariant = await retrieveVariantData(variant_id);

  if (!retrieveVariant) {
    throw new BadRequestError("Failed to delete variant");
  }

  return retrieveVariant;
}
// UPDATE VARIANT SERVICE
export async function updateVariantService(payload: {variant_id: string; variant_data: any;}) {

  if (!payload.variant_id) {
    throw new BadRequestError("Variant ID is required");
  }

  await validateVariantService(payload.variant_data);

  const variant = await getVariantData(payload.variant_id);

  if (!variant) {
    throw new BadRequestError("Variant not found");
  }

  const _payload: any = {
    variant_name: payload.variant_data.variant_name,
    variant_price: Number(payload.variant_data.variant_price),
    variant_stocks: Number(payload.variant_data.variant_stocks),
   
  };

  if (payload.variant_data.variant_image_url) {

    await validateFileService({image: payload.variant_data.variant_image_url});

    const uploadFile = await createFileService({
      image: payload.variant_data.variant_image_url,
      folder_name: "products",
    });

    if (!uploadFile) {
      throw new BadRequestError(
        "Cannot upload file to cloudinary, please try again"
      );
    }

    const fileName = await formatFileService({image: variant.variant_image_url});

    const deleteFile = await deleteFileService({filename: fileName, folder_name: "products"});

    if(!deleteFile) {
      throw new BadRequestError("Failed to delete image from cloudinary, please try again");
    }

    _payload.variant_image_url = uploadFile.url;
  }

  const updateVariant = await updateVariantData({
    variant_id: payload.variant_id,
    variant_data: _payload,
  });

  if (!updateVariant) {
    throw new BadRequestError("Failed to update variant");
  }

  return updateVariant;
}
// VALIDATE VARIANT DATA SERVICE
export async function validateVariantService(variant_data: any) {

  if (
    !variant_data.variant_name ||
    !variant_data.variant_price ||
    !variant_data.variant_stocks
  ) {
    throw new BadRequestError("All fields are required");
  }

  if (isNaN(Number(variant_data.variant_price))) {
    throw new BadRequestError("Price must be a number");
  }

  if (isNaN(Number(variant_data.variant_stocks))) {
    throw new BadRequestError("Stocks must be a number");
  }

}
