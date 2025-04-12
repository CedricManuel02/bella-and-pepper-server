import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../utils/error.js";
import { getNotificationsService, updateNotificationsService } from "../../services/notification/index.js";

// ? DONE CODE CLEANING

// GET ALL NOTIFICATION CONTROLLER
export async function getNotificationsController(c: Context) {
  try {
    const user_id = c.get("user_id") as string;

    const notifications = await getNotificationsService(user_id);

    return c.json({ notifications, status: StatusCodes.OK });
  } catch (error) {
    console.error("Something went wrong in get notification controller:", error);
    throw new BadRequestError("Something went wrong in get notification controller");
  }
}

// UPDATE NOTIFICATION CONTROLLER
export async function updateNotificationsController(c: Context) {
  try {
    const user_id = c.get("user_id") as string;

    await updateNotificationsService(user_id);

    return c.json({ message: "Successfully updated notifications", status: StatusCodes.ACCEPTED });
  } catch (error) {
    console.error("Something went wrong in update notification controller:", error);
    throw new BadRequestError("Something went wrong in update notification controller");
  }
}
