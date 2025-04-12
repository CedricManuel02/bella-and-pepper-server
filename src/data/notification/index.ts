import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../../utils/error.js";
import type { INotification } from "../../interfaces/interface.js";

// ? DONE CODE CLEANING
const prisma = new PrismaClient();

// GET THE USER NOTIFICATION LIST IN THE DATABASE BASED ON THE USER ID
export async function getNotificationsData(user_id: string) {
  try {
    const notifications = await prisma.tbl_notifications.findMany({
      where: { user_receiver_id: user_id },
      orderBy: { notifications_date_created: "desc" },
    });

    return notifications;
  } catch (error) {
    console.error("Failed to get notifications data:", error);
    throw new BadRequestError("Failed to get notification data");
  }
}

// CREATE NOTIFICATION DATA FROM THE DATABASE
export async function createNotificationData(payload: INotification) {
  try {
    const notification = await prisma.tbl_notifications.create({ data: payload });
    return notification;
  } catch (error) {
    console.error("Failed to create notification data:", error);
    throw new BadRequestError("Failed to create notification data");
  }
}

// UPDATE ALL USER NOTIFICATION DATA (TO READ) FROM THE DATABASE
export async function updateNotificationsData(user_id: string) {
  try {
    const notification = await prisma.tbl_notifications.updateMany({
      data: { notifications_read: true },
      where: { user_receiver_id: user_id },
    });

    return notification;
  } catch (error) {
    console.error("Failed to update notification data:", error);
    throw new BadRequestError("Failed to update notification data");
  }
}
