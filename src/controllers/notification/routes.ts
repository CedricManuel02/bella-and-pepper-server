import { Hono } from "hono";
import { getNotificationsController, updateNotificationsController } from "./index.js";
import { authenticationMiddlewares } from "../../middlewares/authentication-middleware.js";

const router = new Hono()
.use("/auth/notifications", authenticationMiddlewares)
.get("/auth/notifications", getNotificationsController)
.put("/auth/notifications", updateNotificationsController)


export default router;

