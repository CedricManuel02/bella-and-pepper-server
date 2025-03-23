import { Hono } from "hono";
import { userAuthenticationMiddlewares } from "../../middlewares/user-authentication-handler.js";
import { getShippingController } from "./index.js";

const router = new Hono()
.use("/auth/shipping", userAuthenticationMiddlewares)
.get("/auth/shipping/:province_id", getShippingController);


export default router;