import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { stripeWebhookCheckoutSuccess } from "../../services/webhook/index.js";
import Stripe from "stripe";
import { BadRequestError } from "../../utils/error.js";

const stripe = new Stripe(process.env.APP_STRIPE_SECRET_KEY! as string);

//STRIPE WEBHOOK
export async function stripeWebhookController(c: Context) {
      const signature = await c.req.header("stripe-signature")

      let event;

      try {
            if (!signature) {
                  throw new BadRequestError("No signature provided");
            }
            const body = await c.req.json();
            
            const parsedBody = JSON.stringify(body, null, 2);

            const headers = stripe.webhooks.generateTestHeaderString({
                  payload: parsedBody,
                  secret: process.env.APP_STRIPE_WEBHOOK_KEY!,
            });

            event = await stripe.webhooks.constructEventAsync(
                  parsedBody,
                  headers,
                  process.env.APP_STRIPE_WEBHOOK_KEY!
            )

      } catch (error) {
            console.error("Failed to validate webhook signature", error);
            throw new BadRequestError("Failed to validate webhook signature");
      }

      switch (event.type) {
            case 'checkout.session.async_payment_failed':
                  const checkoutSessionAsyncPaymentFailed = event.data.object;
                  break;
            case 'checkout.session.async_payment_succeeded':
                  const checkoutSessionAsyncPaymentSucceeded = event.data.object;
                  break;      
            case 'checkout.session.completed':
                  const checkoutSessionCompleted = event.data.object;
                  await stripeWebhookCheckoutSuccess(checkoutSessionCompleted);
                  break;
            case 'checkout.session.expired':
                  const checkoutSessionExpired = event.data.object;
                  break;
            default:
                  console.log(`Unhandled event type ${event.type}`);
      }

      return c.json({ message: "Webhook processed successfully", status: StatusCodes.ACCEPTED });
}
