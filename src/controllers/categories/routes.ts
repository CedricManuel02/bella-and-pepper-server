import { Hono } from "hono";
import { fileUploadMiddleware } from "../../middlewares/file-upload-handler.js";
import { createCategoryController, deleteCategoryController, getCategoriesController, getCategoryController, retrieveCategoryController, updateCategoryController } from "./index.js";
import { adminAuthenticationMiddlewares } from "../../middlewares/admin-authentication-handler.js";

const router = new Hono()
  .use("/auth/categories", adminAuthenticationMiddlewares)
  .get("/categories", getCategoriesController)
  .get("/auth/categories/:category_id", getCategoryController)
  .delete("/auth/categories/:category_id", deleteCategoryController)
  .put("/auth/categories/:category_id", retrieveCategoryController)
  .put("/auth/categories/update/:category_id", fileUploadMiddleware, updateCategoryController)
  .post("/auth/categories", fileUploadMiddleware, createCategoryController)
  
export default router;
