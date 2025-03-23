import { Hono } from "hono";
import { createVariantController, deleteVariantController, retrieveVariantController, updateVariantController } from "./index.js";
import { fileUploadMiddleware } from "../../middlewares/file-upload-handler.js";
import { adminAuthenticationMiddlewares } from "../../middlewares/admin-authentication-handler.js";

const router = new Hono()
.use("/auth/variant", adminAuthenticationMiddlewares)
.post("/auth/variant/create/:product_id", fileUploadMiddleware, createVariantController)
.put("/auth/variant/update/:variant_id", fileUploadMiddleware, updateVariantController)
.delete("/auth/variant/:variant_id", deleteVariantController)
.put("/auth/variant/:variant_id", retrieveVariantController)

export default router;