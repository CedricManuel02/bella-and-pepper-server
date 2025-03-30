import { Hono } from "hono";
import {stripeWebhookController } from "./index.js";

const router = new Hono()
.post("/stripe/webhook", stripeWebhookController)

export default router;