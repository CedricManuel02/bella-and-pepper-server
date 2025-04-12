import { BadRequestError } from "../../utils/error.js";
import { isUserExistingService } from "../user/index.js";
import type { TNotification } from "../../types/types.js";
import { notificationTemplates } from "../../utils/notification-templates.js";
import { createNotificationData, getNotificationsData, updateNotificationsData } from "../../data/notification/index.js";

// ? DONE CODE CLEANING

// SERVICE GET USER LIST OF NOTIFICATION BASED ON USER ID
export async function getNotificationsService(user_id: string) {
  try {
    if (!user_id) throw new BadRequestError("User not found");

    await isUserExistingService(user_id);

    const notifications = await getNotificationsData(user_id);

    if (!notifications) throw new BadRequestError("Notifications not found");

    return notifications;
  } catch (error) {
    console.error("Something went wrong in get notification service:", error);
    throw new BadRequestError("Something went wrong in get notification service");
  }
}

// SERVICE FOR SENDING NOTIFICATION (CREATING NOTIFICATION)
export async function sendNotificationService(payload: TNotification) {
  try {
    const { action, order_id, order_number, product_name, user_name, user_sender_id, user_receiver_id } = payload;

    if (!user_sender_id || !user_receiver_id) throw new BadRequestError(`${!user_sender_id ? "Sender ID" : "User ID"} is required`);

    const { notification_body, notification_title } = await formatNotificationService({
      action,
      order_number,
      product_name,
      user_name,
    });

    const notification = await createNotificationData({
      notifications_title: notification_title,
      notifications_body: notification_body,
      order_id,
      user_sender_id,
      user_receiver_id,
      status: action,
    });

    if (!notification) throw new BadRequestError("Failed to create notification");

    return notification;
  } catch (error) {
    console.error("Something went wrong in send notification service:", error);
    throw new BadRequestError("Something went wrong in send notification service");
  }
}

// SERVICE FOR UPDATING THE NOTIFICATION (READ TO UNREAD)
export async function updateNotificationsService(user_id: string) {
  try {
    if (!user_id) throw new BadRequestError("User Id is required");

    await isUserExistingService(user_id);

    const updateNotification = await updateNotificationsData(user_id);

    if (!updateNotification) throw new BadRequestError("Failed to update notification");

    return updateNotification;
  } catch (error) {
    console.error("Something went wrong in update notification service:", error);
    throw new BadRequestError("Something went wrong in update notification service");
  }
}

// SERVICE FORMAT NOTIFICATION TITLE AND BODY
async function formatNotificationService({ action, order_number, product_name, user_name }: TNotification) {
  try {
    const notification_template = notificationTemplates[action as keyof typeof notificationTemplates];

    if (!notification_template) throw new BadRequestError("Invalid notification action");

    const notification_title = notification_template.title;

    const notification_body = notification_template.body(order_number ?? "", product_name ?? "", user_name ?? "");

    return { notification_title, notification_body };
  } catch (error) {
    console.error("Something went wrong in format notification service:", error);
    throw new BadRequestError("Something went wrong in format notification service");
  }
}
