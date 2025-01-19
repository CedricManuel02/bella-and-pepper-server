import { Hono } from "hono";
import { getUser, loginAccountController, registerAccountController } from "./index.js";

const router = new Hono()
.post("/login", loginAccountController)
.post("/register", registerAccountController)
.post("/user", getUser)

export default router;
