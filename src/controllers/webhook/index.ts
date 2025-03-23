import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { webhookServices } from "../../services/webhook/index.js";

export async function paymongoWebhookController(c: Context) {
      const rawBody = await c.req.text();

      const payload = JSON.parse(rawBody);
      
      await webhookServices(payload);
  
      return c.json({ message: "Webhook processed successfully", status: StatusCodes.ACCEPTED});
}
