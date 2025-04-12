import { Hono } from "hono";
import { userAuthenticationMiddlewares } from "../../middlewares/user-authentication-handler.js";
import { createRatingController, deleteRatingController } from "./index.js";
import { fileUploadMiddleware } from "../../middlewares/file-upload-handler.js";
import { adminAuthenticationMiddlewares } from "../../middlewares/admin-authentication-handler.js";

const router = new Hono()
  .use("/auth/rating/*", userAuthenticationMiddlewares) 
  .use("/auth/delete-rating/file/*", fileUploadMiddleware) 
  .post("/auth/rating/product/:variant_id/:order_id", fileUploadMiddleware, createRatingController)
  .delete("/auth/delete-rating/file/:rating_id", adminAuthenticationMiddlewares, deleteRatingController)

export default router;
