import { PrismaClient } from "@prisma/client";
import type { INotification } from "../../interfaces/interface.js";

const prisma = new PrismaClient();
export async function getNotificationsData(payload: {user_id: string}) {
  const notifications = await prisma.tbl_notifications.findMany({
    where: {user_receiver_id: payload.user_id},
  });

  return notifications;
}

export async function createNotificationData(notification: INotification) {
  const _notification = await prisma.tbl_notifications.create({
    data: {
        notifications_title: notification.notification_title,
        notifications_body: notification.notification_body,
        user_sender_id: notification.user_sender_id,
        user_receiver_id: notification.user_receiver_id,
        status: notification.status
     }
  });

  return _notification
}


export async function updateNotificationsData(payload: {user_id: string}) {
  const notification = await prisma.tbl_notifications.updateMany({
    data: {
      notifications_read: true
    },
    where: {
      user_receiver_id: payload.user_id
    }
  });

  return notification;
}