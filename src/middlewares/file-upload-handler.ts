import type { Context, Next } from "hono";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { UnauthorizedError } from "../utils/error.js";

dotenv.config();
export async function fileUploadMiddleware(c: Context, next: Next) {
  try {
    cloudinary.config({
      cloud_name: process.env.APP_CLOUD_NAME,
      api_key: process.env.APP_CLOUD_API_KEY,
      api_secret: process.env.APP_CLOUD_API_SECRET_KEY,
    });

    return await next();
  } catch (err) {
    throw new UnauthorizedError("Invalid cloudinary credentials");
  }
}
