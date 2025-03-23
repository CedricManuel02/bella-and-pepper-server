import { Hono } from "hono";
import { adminAuthenticationMiddlewares } from "../../middlewares/admin-authentication-handler.js";
import { createProductController, deleteProductController, getProductController, getProductsController, retrieveProductController, updateProductController } from "./index.js";
import { fileUploadMiddleware } from "../../middlewares/file-upload-handler.js";

const router = new Hono()
  .use("/auth/product", adminAuthenticationMiddlewares)
  .get("/products", getProductsController)
  .get("/product/:product_id", getProductController)
  .post("/product", fileUploadMiddleware, createProductController)
  .delete("/auth/product/:product_id", deleteProductController)
  .put("/auth/product/:product_id", updateProductController)
  .put("/auth/product/retrieve/:product_id", retrieveProductController)

export default router;
