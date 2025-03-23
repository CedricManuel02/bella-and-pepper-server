import { createNotificationData, getNotificationsData, updateNotificationsData } from "../../data/notification/index.js";
import { getUserData } from "../../data/user/index.js";
import type { Status } from "../../utils/enum.js";
import { BadRequestError } from "../../utils/error.js";

export async function getNotificationsService(payload: { user_id: string }) {
  if (!payload.user_id) {
    throw new BadRequestError("User not found");
  }

  const user = await getUserData(payload.user_id);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const notifications = await getNotificationsData({
    user_id: payload.user_id,
  });

  if (!notifications) {
    throw new BadRequestError("Notifications not found");
  }

  return notifications;
}

export async function sendNotificationService(payload: {
  action: Status;
  order_number?: string;
  product_name?: string;
  user_name?: string;
  user_sender_id: string;
  user_receiver_id: string;
}) {
  let notification_title = "";
  let notification_body = "";

  switch (payload.action) {
    case "PLACED_ORDER":
      notification_title = "Order Confirmed";
      notification_body = `Thank you for your purchase! Your order #${payload.order_number} has been successfully placed. We'll update you once it's processed.`;
      break;

    case "PAID":
      notification_title = "Payment Successful";
      notification_body = `We've received your payment for order #${payload.order_number}. Your order is now being processed. Stay tuned for shipping updates!`;
      break;

    case "SHIPPED":
      notification_title = "Your Order is on the Way!";
      notification_body = `Great news! Your order #${payload.order_number} has been shipped and is on its way.`;
      break;

    case "DELIVERED":
      notification_title = "Order Successfully Delivered";
      notification_body = `Great news! order #${payload.order_number} has been delivered to its destination`;
      break;

    case "RATING":
      notification_title = "Someone rate your product";
      notification_body = `${payload.user_name} rated product ${payload.product_name}`;
      break;
    case "CANCELLED":
      notification_title = "Someone rate your product";
      notification_body = `${payload.user_name} rated product ${payload.product_name}`;
      break;
    default:
      throw new BadRequestError("Invalid action");
  }

  if (!notification_title || !notification_body) {
    throw new BadRequestError("Missing notification details");
  }

  const createNotification = await createNotificationData({
    notification_title: notification_title,
    notification_body: notification_body,
    user_sender_id: payload.user_sender_id,
    user_receiver_id: payload.user_receiver_id,
    status: payload.action,
  });

  if (!createNotification) {
    throw new BadRequestError("Failed to create notification");
  }

  return createNotification;
}

export async function updateNotificationsService(payload: { user_id: string }) {
  if (!payload.user_id) {
    throw new BadRequestError("User Id is required");
  }

  const user = await getUserData(payload.user_id);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const updateNotification = await updateNotificationsData({
    user_id: payload.user_id,
  });

  if (!updateNotification) {
    throw new BadRequestError("Failed to update notification");
  }

  return updateNotification;
}
