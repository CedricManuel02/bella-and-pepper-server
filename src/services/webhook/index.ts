import { getOrderByPaymentIdData, getOrderByPaymentIntentData } from "../../data/order/index.js";
import { getVariantData, updateVariantStockData } from "../../data/variant/index.js";
import { BadRequestError } from "../../utils/error.js";
import { deleteCartByVariantIdService } from "../cart/index.js";
import { updateCheckoutService } from "../checkout/index.js";

export async function webhookServices(payload: any) {
  const {
    data: {
      attributes: { type },
    },
  } = payload;

  switch (type) {
    case "checkout_session.payment.paid":
      paymongoWebhookCheckoutPaid(payload);
      break;
    case "payment.refunded":
      paymongoWebhookCheckoutRefunded(payload);
      break;
    default:
      throw new BadRequestError("Failed to process webhook");
  }
}

export async function paymongoWebhookCheckoutPaid(payload: any) {
  const {
    data: {
      attributes: {
        data: { attributes },
      },
    },
  } = payload;

  if (!attributes) {
    throw new BadRequestError("Invalid webhook payload structures");
  }

  const payment_intent_id = attributes.payment_intent.id;
  const payment_unique_id = attributes.payments[0]?.id;
  const payment_transaction_fee = attributes.payments[0]?.attributes?.fee;
  const payment_method = attributes.payment_method_used;
  const payment_date_paid = new Date(attributes.paid_at * 1000);
  const payment_status = attributes.payment_intent.attributes.payments[0].attributes.status.toUpperCase();

  const updatedCheckout = await updateCheckoutService({
    payment_intent_id: payment_intent_id,
    payment_status: payment_status,
    payment_date_paid: payment_date_paid,
    payment_method: payment_method,
    payment_transaction_fee: payment_transaction_fee,
    payment_unique_id: payment_unique_id,
  });

  if (!updatedCheckout) {
    throw new BadRequestError("Failed to update checkout");
  }

  const order = await getOrderByPaymentIntentData({
    payment_intent_id: payment_intent_id,
  });

  if (!order) {
    throw new BadRequestError("Failed to get order");
  }

  if (payment_status === "PAID") {
    const deleteCart = await deleteCartByVariantIdService({
      variant: order.tbl_items,
      user_id: order.user_id,
    });

    if (!deleteCart) {
      throw new BadRequestError("Failed to delete cart");
    }

    for (let i = 0; i < order.tbl_items.length; i++) {
      const variant = await getVariantData(order.tbl_items[i].variant_id);

      if (!variant) {
        throw new BadRequestError("Failed to get variant");
      }

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
  return updatedCheckout;
}

export async function paymongoWebhookCheckoutRefunded(payload: any) {
  const {
    data: {
      attributes: { amount, payment_id, reason },
    },
  } = payload;

  if (!payload) throw new BadRequestError("Failed to retrieve refund webhook");

  const order = await getOrderByPaymentIdData({ payment_id });
}
