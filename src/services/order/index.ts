import type { CancelledReason } from "@prisma/client";
import { getUserData } from "../../data/user/index.js";
import { BadRequestError } from "../../utils/error.js";
import { getAdminAccountData } from "../../data/account/index.js";
import { sendNotificationService } from "../notification/index.js";
import { expiredStripeCheckoutSessionLink } from "../../utils/payment.js";
import { createCancelledOrderData } from "../../data/cancelled-order/index.js";
import { createOrderStatusData, deleteOrderData, deletePlacedOrderNotPaidData, generateSalesReportData, geOrderItemData, getAllOrdersData, getOrderByPaymentIntentData, getPlacedOrdersNotPaidData, getUserOrderData, getUserOrdersData } from "../../data/order/index.js";

// GET ALL ORDERS (ADMIN REQUEST)
export async function getAllOrdersService() {
  const orders = await getAllOrdersData();

  if (!orders) {
    throw new BadRequestError("Failed to get all orders");
  }

  return orders;
}
// GET ALL ORDERS OF USER (USER REQUEST)
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
// GET SINGLE ORDER SERVICE (USER REQUEST)
export async function getOrderService(payload: { order_id: string; user_id: string }) {
  if (!payload.user_id) {
    throw new BadRequestError("User id is required");
  }

  const user = await getUserData(payload.user_id);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const order = await getUserOrderData({ order_id: payload.order_id });

  if (!order) {
    throw new BadRequestError("Order not found");
  }

  return order;
}
// GET SINGLE ORDER SERVICE (ADMIN REQUEST)
export async function getOrderItemService(payload: { order_id: string }) {
  if (!payload.order_id) throw new BadRequestError("Order ID is required");
  
  const order = await geOrderItemData({ order_id: payload.order_id });

  if (!order) throw new BadRequestError("Order not found");

  return order;
}
// RECEIVED ORDER SERVICE
export async function receivedOrderService(payload: { order_id: string; user_id: string }) {
  if (!payload.order_id) {
    throw new BadRequestError("Order is required");
  }

  const user = await getUserData(payload.user_id);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const order = await getUserOrderData({ order_id: payload.order_id });

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

  const order = await getUserOrderData({ order_id });

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
// DELETE ORDER SERVICE (USED FOR CANCELLED ORDER CHECKOUT AND RUN AN EXPIRATION FUNCTION)
export async function deleteOrderService({session_id, user_id}: {session_id: string, user_id: string}) {
  if(!session_id || !user_id) throw new BadRequestError(session_id ? "Session is required" : "User ID is required");

  const session = await getOrderByPaymentIntentData({payment_unique_id: session_id});

  if(!session) throw new BadRequestError("Checkout session not found");

  const orderDelete = await deleteOrderData({order_id: session.order_id, user_id});

  if(!orderDelete) throw new BadRequestError("Failed to delete order");

  await expiredStripeCheckoutSessionLink({checkout_session: session_id});

  return orderDelete;
}
// DELETE ORDER CONTROLLER (USED FOR CRON JOB TO CHECK IF THE ORDER IS IDLE FOR TOO LONG)
export async function deleteOrderCronJobService() {
  const current_date = new Date();
  const one_hour_ago = new Date(current_date.getTime() - 60 * 60 * 1000); 

  const orders_not_paid = await getPlacedOrdersNotPaidData();

  if(orders_not_paid) {
    for(let i = 0; i < orders_not_paid.length; i++) {
      const order = orders_not_paid[i];

      const order_date_created = new Date(order.order_date_created);

      if(order_date_created < one_hour_ago) {
        await deletePlacedOrderNotPaidData({order_id: order.order_id});
        console.log(`ORDER ${order.order_id} has been deleted due to inactivity`);
        await expiredStripeCheckoutSessionLink({checkout_session: order.tbl_order_payment?.payment_unique_id as string});
      }
    }
  }
}


// GENERATE SALES REPORT SERVICE
export async function generateSalesReportService({start_date, end_date}: { start_date: string; end_date: string }) {
  if (!start_date || !end_date) throw new BadRequestError("Start date and end date are required");

  const salesReport = await generateSalesReportData({ start_date: new Date(start_date), end_date: new Date(end_date) });

  if (!salesReport) throw new BadRequestError("Failed to generate sales report");

  if (salesReport.length === 0) throw new BadRequestError("No sales report found for the given date range");

  return salesReport;
}