import {
  createOrderData,
  getOrderByPaymentIntentData,
  updateOrderData,
} from "../../data/order/index.js";
import { getProductData } from "../../data/product/index.js";
import { getShippingData } from "../../data/shipping/index.js";
import { getUserData } from "../../data/user/index.js";
import { getVariantData } from "../../data/variant/index.js";
import type {
  ICheckout,
  IInformation,
  ILocation,
} from "../../interfaces/interface.js";
import { BadRequestError } from "../../utils/error.js";
import { generateUniqueOrderNumber } from "../../utils/helper.js";
import { checkoutPaymongoPayment } from "../../utils/payment.js";

export async function createCheckoutService(payload: { information: IInformation; checkout: ICheckout[]; location: ILocation;}, user_id: string) {

  const {user_location, delivery_location} = payload.location;

  const validatedUser = await getUserData(user_id);

  if (!validatedUser) {
    throw new BadRequestError("Invalid User");
  }

  const validatedInformation = await validateInformation({
    information: payload.information,
  });

  if (!validatedInformation) {
    throw new BadRequestError("Failed to validate information");
  }

  const validateCheckoutProducts = await validateCheckoutProduct({
    checkout: payload.checkout,
  });

  if (!validateCheckoutProducts) {
    throw new BadRequestError("Failed to validate checkout products");
  }

  if (!user_location.longitude || !user_location.latitude) {
    throw new BadRequestError("Permission denied for location");
  }
  if (!delivery_location.longitude || !delivery_location.latitude) {
    throw new BadRequestError("Pin location of delivery location is required");
  }
  
  const checkoutPaymongo = await checkoutPaymongoPayment({
    shipping_fee_rate: validatedInformation.shipping_fee_rate,
    checkout: payload.checkout,
  });

  if (!checkoutPaymongo) {
    throw new BadRequestError("Failed to checkout payment");
  }

  // Generate random order number
  const order_number = await generateUniqueOrderNumber();

  // Get the targeted date received
  const order_target_date_received = new Date(
    Date.now() +
      validatedInformation.expected_shipping_days * 24 * 60 * 60 * 1000
  );


  const orderCreate = await createOrderData({
    information: payload.information,
    checkout: payload.checkout,
    location: payload.location,
    payment_intent_id: checkoutPaymongo.payment_intent_id,
    status: "PLACED_ORDER",
    order_number: order_number,
    order_target_date_received: order_target_date_received,
    user_id: user_id,
    shipping_fee_id: validatedInformation.shipping_fee_id,
    shipping_fee_rate: validatedInformation.shipping_fee_rate,
  });

  if(!orderCreate){
    throw new BadRequestError("Failed to create order")
  }
  
  return checkoutPaymongo.checkout_url;
}

export async function updateCheckoutService(payload: {
  payment_date_paid: Date;
  payment_intent_id: string;
  payment_status: string;
  payment_method: string;
  payment_transaction_fee: number;
  payment_unique_id: string;

}) {
  if (!payload.payment_intent_id) {
    throw new BadRequestError("Payment intent Id is required");
  }

  const paymentIntent = await getOrderByPaymentIntentData({
    payment_intent_id: payload.payment_intent_id,
  });

  if (!paymentIntent) {
    throw new BadRequestError("Payment intent not found");
  }

  const updatePayment = await updateOrderData({
    order_id: paymentIntent.order_id,
    payment_date_paid: payload.payment_date_paid,
    payment_status: payload.payment_status,
    payment_method: payload.payment_method,
    status: "PAID",
    payment_transaction_fee: payload.payment_transaction_fee,
    payment_unique_id: payload.payment_unique_id
  });

  if (!updatePayment) {
    throw new BadRequestError("Failed to update payment intent");
  }

  return updatePayment;
}
// VALIDATE THE USER INFORMATION
async function validateInformation(payload: { information: IInformation }) {
  if (
    !payload.information.firstname ||
    !payload.information.lastname ||
    !payload.information.email ||
    !payload.information.phone ||
    !payload.information.province ||
    !payload.information.cities ||
    !payload.information.barangay || 
    !payload.information.order_policy_aggreement
  ) {
    throw new BadRequestError("All fields is required");
  }

  if(!payload.information.order_policy_aggreement) {
    throw new BadRequestError("You must aggree to the store policy");
  }

  const provinceData = await getShippingData({
    province: payload.information.province,
  });

  if (!provinceData) {
    throw new BadRequestError("Shipping province is not available");
  }

  return provinceData;
}
// VALIDATE THE USER CHECKOUT PRODUCT
async function validateCheckoutProduct(payload: { checkout: ICheckout[] }) {
  if (payload.checkout.length === 0 || !payload.checkout) {
    throw new BadRequestError("Missing checkout items");
  }

  for (let i = 0; i < payload.checkout.length; i++) {
    const product = await getProductData(
      payload.checkout[i].tbl_products?.product_id!
    );

    if (!product) {
      throw new BadRequestError("Product not found");
    }

    if (product.product_date_deleted !== null) {
      throw new BadRequestError("Product is not available");
    }

    const variant = await getVariantData(
      payload.checkout[i].tbl_variants.variant_id
    );

    if (!variant) {
      throw new BadRequestError("Variant not found");
    }

    if (variant.variant_date_deleted !== null) {
      throw new BadRequestError("Variant is not available");
    }

    if (variant.product_id !== product.product_id) {
      throw new BadRequestError(
        "This variant is not available on this product"
      );
    }

    if (payload.checkout[i].quantity > variant.variant_stocks) {
      throw new BadRequestError("Exceeded quantity for this variant");
    }
  }

  return true;
}
