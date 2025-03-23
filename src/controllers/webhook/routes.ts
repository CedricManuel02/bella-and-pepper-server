import { Hono } from "hono";
import { paymongoWebhookController } from "./index.js";

const router = new Hono()
.post("/paymongo/webhook", paymongoWebhookController)

export default router;