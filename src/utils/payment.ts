import Stripe from "stripe";
import type { ICheckout } from "../interfaces/interface.js";
import { BadRequestError } from "./error.js";

const stripe = new Stripe(process.env.APP_STRIPE_SECRET_KEY! as string);
// STRIPE PAYMENT METHOD
export async function checkoutStripePayment(payload: { shipping_fee_rate: number; checkout: ICheckout[] }) {
  let lineItems: any = [];

  payload.checkout.map((product: ICheckout) => {
    lineItems.push({
      price_data: {
        currency: "PHP",
        product_data: {
          images: [product.tbl_variants.variant_image_url],
          name: product.tbl_products.product_name,
        },
        unit_amount: product.tbl_variants.variant_price * 100,
      },
      quantity: product.quantity,
    });
  });

  // Stripe integration

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: payload.shipping_fee_rate * 100,
            currency: "php",
          },
          display_name: "Shipping Fee",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
    ],
    success_url: `${process.env.APP_FRONT_END_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_FRONT_END_URL}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (session.url) {
    // await getStripePaymentIntent({ session_id: session.id });
    return { session: session, checkout_url: session.url };
  } else {
    throw new BadRequestError("Failed to create checkout session");
  }
}
// GET THE PAYMENT INTENT INTO STRIPE
export async function getStripePaymentIntent(payload: { session_id: string }) {
  const session = await stripe.checkout.sessions.retrieve(payload.session_id, {
    expand: ["payment_intent.payment_method"],
  });

  // LIST ALL THE PRODUCT
  const list = await stripe.checkout.sessions.listLineItems(payload.session_id);

  return session;
}

// GET EXPIRED THE CHECKOUT SESSION
export async function expiredStripeCheckoutSessionLink({checkout_session}:{checkout_session: string}) {
  try {
    const session = await stripe.checkout.sessions.expire(checkout_session);
    
    if(!session) throw new BadRequestError("Failed to expired the link");

    return session;
  } catch (error) {
    console.error("Something went wrong while expiring the checkout session link:", error);
    throw new BadRequestError("Something went wrong while expiring the checkout session link");
  }
}