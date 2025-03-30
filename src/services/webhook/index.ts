import {  getOrderByPaymentIntentData } from "../../data/order/index.js";
import { getVariantData, updateVariantStockData } from "../../data/variant/index.js";
import { BadRequestError } from "../../utils/error.js";
import { deleteCartByVariantIdService } from "../cart/index.js";
import { updateCheckoutService } from "../checkout/index.js";

export async function webhookStripeServices(payload: any) {
  switch (payload.object) {
    case "checkout.session":
      await stripeWebhookCheckoutSuccess(payload);
      break;
    default:
      throw new BadRequestError("Failed to process webhook");
  }
}

export async function stripeWebhookCheckoutSuccess(payload: any) {
  const payment_unique_id = payload.id;
  const payment_intent_id = payload.payment_intent;
  const payment_method = payload.payment_method_types[0];
  const payment_date_paid = new Date(payload.created * 1000);
  const payment_status = payload.payment_status.toUpperCase();

  const updatedCheckout = await updateCheckoutService({
    payment_unique_id: payment_unique_id,
    payment_intent_id: payment_intent_id,
    payment_status: payment_status,
    payment_date_paid: payment_date_paid,
    payment_method: payment_method,
  });

  if (!updatedCheckout) throw new BadRequestError("Failed to update checkout");

  const order = await getOrderByPaymentIntentData({
    payment_unique_id: payment_unique_id,
  });

  if (!order) throw new BadRequestError("Failed to get order");

  if (payment_status === "PAID") {
    const deleteCart = await deleteCartByVariantIdService({ variant: order.tbl_items, user_id: order.user_id });

    if (!deleteCart) throw new BadRequestError("Failed to delete cart");

    for (let i = 0; i < order.tbl_items.length; i++) {
      const variant = await getVariantData(order.tbl_items[i].variant_id);

      if (!variant) throw new BadRequestError("Failed to get variant");

      const newVariantStocks = variant?.variant_stocks - order.tbl_items[i].item_quantity;

      const updateStocks = await updateVariantStockData({
        variant_id: order.tbl_items[i].variant_id,
        variant_stock: newVariantStocks,
      });

      if (!updateStocks) {
        throw new BadRequestError("Failed to less the stocks");
      }
    }
  }
  return null;
}
