import Stripe from "stripe";
import type { ICheckout } from "../interfaces/interface.js";
import { BadRequestError } from "./error.js";

const stripe = new Stripe(process.env.APP_STRIPE_SECRET_KEY! as string);

// PAYMONGO PAYMENT METHOD
export async function checkoutPaymongoPayment(payload: { shipping_fee_rate: number; checkout: ICheckout[] }) {
  const lineItems = [];

  lineItems.push({
    amount: payload.shipping_fee_rate * 100,
    currency: "PHP",
    name: "Shipping Fee",
    quantity: 1,
  });

  payload.checkout.map((product: ICheckout) => {
    lineItems.push({
      amount: product.tbl_variants.variant_price * 100,
      currency: "PHP",
      name: product.tbl_products.product_name,
      quantity: product.quantity,
    });
  });

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Basic c2tfdGVzdF9aWkVWejZWSGdYOThMSnpxSkNEckpYaVU6",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          send_email_receipt: false,
          show_description: true,
          show_line_items: false,
          description: "Purchasing at Bella and Pepper Korean Food and Beverages Store",
          line_items: lineItems,
          payment_method_types: ["gcash"],
          cancel_url: `${process.env.APP_FRONT_END_URL}/payment/error`,
          success_url: `${process.env.APP_FRONT_END_URL}/payment/success`,
        },
      },
    }),
  };

  try {
    const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", options);
    const data = await response.json();
    const checkoutUrl = data.data.attributes.checkout_url;
    const paymentIntent = data.data.attributes.payment_intent;
    if (checkoutUrl && paymentIntent && paymentIntent.id) {
      return {
        checkout_url: checkoutUrl,
        payment_intent_id: paymentIntent.id,
      };
    } else {
      throw new Error("Failed to retrieve checkout URL or payment intent details");
    }
  } catch (error) {
    console.error("PayMongo Error:", error);
    throw new Error("Failed to create checkout session");
  }
}

// REFUND PAYMONGO PAYMENT
export async function refundPaymongoPayment(payload: { payment_unique_id: string; amount: number; notes?: string; reason: string }) {
  const url = "https://api.paymongo.com/refunds";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Basic c2tfdGVzdF9aWkVWejZWSGdYOThMSnpxSkNEckpYaVU6",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: payload.amount,
          notes: payload.notes,
          payment_id: payload.payment_unique_id,
          reason: payload.reason,
        },
      },
    }),
  };

  fetch(url, options)
    .then((res) => {
      return res;
    })
    .then((json) => {
      throw new BadRequestError("Failed to refund this order, please try again");
    })
    .catch((err) => {
      throw new BadRequestError("Something went wrong while processing your refund");
    });
}

// STRIPE PAYMENT METHOD
export async function checkoutStripePayment(payload: { shipping_fee_rate: number; checkout: ICheckout[] }) {
  const lineItems = [];

  lineItems.push({
    price_data: {
      currency: "PHP",
      product_data: {
        name: "Shipping Fee",
      },
      unit_amount: payload.shipping_fee_rate * 100,
    },
    quantity: 1,
  });

  payload.checkout.map((product: ICheckout) => {
    lineItems.push({
      price_data: {
        currency: "PHP",
        product_data: {
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
    success_url: `${process.env.APP_FRONT_END_URL}/payment/success`,
    cancel_url: `${process.env.APP_FRONT_END_URL}/payment/cancel`,
  });

  if (session.url) {
    // STILL UNPAID HERE
    await getStripePaymentIntent({ session_id: session.id });
    return session.url;
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

  console.log("This is the payment intent", session);
  console.log("This is the payment product list ", list);
}
