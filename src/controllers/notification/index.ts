import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { getNotificationsService, updateNotificationsService } from "../../services/notification/index.js";

export async function getNotificationsController(c: Context) {
  const user_id = c.get("user_id");
  
  const notifications = await getNotificationsService({ user_id });

  return c.json({ notifications: notifications, status: StatusCodes.OK });
}

export async function updateNotificationsController(c: Context) {
  const user_id = c.get("user_id");
  await updateNotificationsService({ user_id });

  return c.json({ message: "Successfully updated notifications", status: StatusCodes.OK });
}
