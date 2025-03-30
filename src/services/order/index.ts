import type { CancelledReason } from "@prisma/client";
import { getAdminAccountData } from "../../data/account/index.js";
import { createCancelledOrderData } from "../../data/cancelled-order/index.js";
import { createOrderStatusData, geOrderItemData, getAllOrdersData, getUserOrderData, getUserOrdersData } from "../../data/order/index.js";
import { getUserData } from "../../data/user/index.js";
import { BadRequestError } from "../../utils/error.js";
import { sendNotificationService } from "../notification/index.js";

export async function getAllOrdersService() {
  const orders = await getAllOrdersData();

  if (!orders) {
    throw new BadRequestError("Failed to get all orders");
  }

  return orders;
}

export async function getOrdersService(payload: { user_id: string }) {
  if (!payload.user_id) {
    throw new BadRequestError("User id is required");
  }

  const user = await getUserData(payload.user_id);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const order = await getUserOrdersData({ user_id: user.user_id });

  if (!order) {
    throw new BadRequestError("Orders not found");
  }

  return order;
}

export async function getOrderService(payload: { order_id: string; user_id: string }) {
  if (!payload.user_id) {
    throw new BadRequestError("User id is required");
  }

  const user = await getUserData(payload.user_id);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const order = await getUserOrderData({ order_id: payload.order_id, user_id: user.user_id });

  if (!order) {
    throw new BadRequestError("Order not found");
  }

  return order;
}

export async function getOrderItemService(payload: { order_id: string }) {
  if (!payload.order_id) {
    throw new BadRequestError("Order ID is required");
  }
  const order = await geOrderItemData({ order_id: payload.order_id });

  if (!order) {
    throw new BadRequestError("Order not found");
  }

  return order;
}

export async function receivedOrderService(payload: { order_id: string; user_id: string }) {
  if (!payload.order_id) {
    throw new BadRequestError("Order is required");
  }

  const user = await getUserData(payload.user_id);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const order = await getUserOrderData({ order_id: payload.order_id, user_id: payload.user_id });

  if (!order) {
    throw new BadRequestError("Order not found");
  }

 

  const updateOrderReceived = await createOrderStatusData({ order_id: payload.order_id, status: "DELIVERED" });

  if (!updateOrderReceived) {
    throw new BadRequestError("Order received failed");
  }

  const admin = await getAdminAccountData();

  if (!admin) {
    throw new BadRequestError("Admin account not found");
  }

  const sendNotification = await sendNotificationService({
    action: "DELIVERED",
    order_number: order.order_number,
    user_receiver_id: admin,
    user_sender_id: user.user_id,
  });

  if (!sendNotification) {
    throw new BadRequestError("Failed to create notification");
  }

  return updateOrderReceived;
}

// CANCELLED ORDER SERVICE

export async function cancelledOrderService({ order_id, user_id, reason }: { order_id: string; user_id: string; reason: CancelledReason }) {
    
  if (!order_id) throw new BadRequestError("Order is required");

  if (!user_id) throw new BadRequestError("User is required");

  const user = await getUserData(user_id);

  if (!user) throw new BadRequestError("User not found");

  const order = await getUserOrderData({ order_id, user_id });

  if (!order) throw new BadRequestError("Order not found");

  const createOrderStatus = await createOrderStatusData({ order_id: order.order_id, status: "CANCELLED" });

  if (!createOrderStatus) throw new BadRequestError("Failed to create order status");

  const createCancelledOrder = await createCancelledOrderData({ order_id: order.order_id, reason: reason });

  if (!createCancelledOrder) throw new BadRequestError("Failed to create cancelled order");

  const totalItemsAmount = order.tbl_items.reduce((total, item) => total + (item.item_product_price_at_time_purchase * item.item_quantity), 0);

  const totalRefundedAmount = order.order_shipping_fee + totalItemsAmount;

// add webhook refund 
  return createCancelledOrderData;
}
