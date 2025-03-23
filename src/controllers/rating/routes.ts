import { Hono } from "hono";
import { userAuthenticationMiddlewares } from "../../middlewares/user-authentication-handler.js";
import { createRatingController } from "./index.js";
import { fileUploadMiddleware } from "../../middlewares/file-upload-handler.js";

const router = new Hono()
.use("/auth/rating", userAuthenticationMiddlewares)
.post("/auth/rating/:variant_id/:order_id/:user_id", fileUploadMiddleware, createRatingController)

export default router;