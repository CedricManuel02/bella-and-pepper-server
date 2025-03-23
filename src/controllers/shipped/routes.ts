import { Hono } from "hono";
import { adminAuthenticationMiddlewares } from "../../middlewares/admin-authentication-handler.js";
import { createShippedController } from "./index.js";
import { fileUploadMiddleware } from "../../middlewares/file-upload-handler.js";

const router = new Hono()
.use("/auth/shipped", adminAuthenticationMiddlewares)
.post("/auth/shipped/:order_number/:user_id", fileUploadMiddleware ,createShippedController)

export default router;