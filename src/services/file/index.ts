import { v2 as cloudinary } from "cloudinary";
import { encodeBase64 } from "hono/utils/encode";
import { BadRequestError } from "../../utils/error.js";
import { IMAGE_FORMAT, MAX_FILE_SIZE } from "../../constant/constant.js";

export async function createFileService(payload: {image: File; folder_name: string;}) {

  const byteArrayBuffer = await payload.image.arrayBuffer();

  const based64 = encodeBase64(byteArrayBuffer);

  const result = await cloudinary.uploader.upload(`data:${payload.image.type};base64,${based64}`,{ folder: payload.folder_name });
  
  return result;
}

export async function deleteFileService(payload: {filename: string; folder_name: string;}) {
  const result = await cloudinary.api.delete_resources(
    [`${payload.folder_name}/${payload.filename}`],
    {
      type: "upload",
      resource_type: "image",
    }
  );

  return result;
}

export async function validateFileService(payload: { image: File }) {
  if (!IMAGE_FORMAT.includes(payload.image.type)) {
    throw new BadRequestError(
      "Invalid image format. Only PNG, JPEG, and JPG are allowed"
    );
  }

  if (payload.image.size > MAX_FILE_SIZE) {
    throw new BadRequestError(
      "File size is too large, please upload a file size 10MB below"
    );
  }
}


export async function formatFileService(payload: { image: string }) {
  
  if(!payload.image){
    throw new BadRequestError("Image is required");
  }

  const first_index = payload.image.lastIndexOf("/") + 1;
  
  const last_index =  payload.image.lastIndexOf(".");

  const name = payload.image.slice(first_index, last_index);

  return name;
  
}