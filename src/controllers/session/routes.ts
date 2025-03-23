import { Hono } from "hono";
import { authenticationMiddlewares } from "../../middlewares/admin-authentication-handler.js";
import { getSessionController } from "./index.js";

const router = new Hono()
.use("/auth/verify/session", authenticationMiddlewares)
.get("/auth/verify/session", getSessionController)

export default router;