import { createDeliveryData } from "../../data/delivery/index.js";
import { createOrderStatusData, getOrderByOrderNumber} from "../../data/order/index.js";
import { createShippedOrderImageData } from "../../data/shipped/index.js";
import { getUserData } from "../../data/user/index.js";
import { BadRequestError, UnauthorizedError } from "../../utils/error.js";
import { createFileService, validateFileService } from "../file/index.js";
import { sendNotificationService } from "../notification/index.js";

export async function createShippedService(payload: {order_number: string; shipped_details: any; user_sender_id: string;}) {

  if (!payload.order_number) {
    throw new BadRequestError("No order id provided");
  }

  if (!payload.shipped_details) {
    throw new BadRequestError("Shipped details not provided");
  }

  if (
    !payload.shipped_details.delivery_company ||
    !payload.shipped_details.delivery_rider_name ||
    !payload.shipped_details.delivery_rider_phone ||
    !payload.shipped_details.delivery_plate_number ||
    !payload.shipped_details.delivery_tracking_number
  ) {
    throw new BadRequestError("Shipped details not complete");
  }

  const order = await getOrderByOrderNumber({ order_number: payload.order_number });

  if (!order) {
    throw new BadRequestError("Order not found");
  }

  const user = await getUserData(payload.user_sender_id);

  if(user?.roles !== "ADMIN"){
    throw new UnauthorizedError("Not authorized action");
  }

  const createOrderStatus = await createOrderStatusData({ status: "SHIPPED", order_id: order.order_id });

  if (payload.shipped_details.item_image) {
    if (Array.isArray(payload.shipped_details.item_image)) {
      payload.shipped_details.item_image.forEach((file: File) => {
        if (!file) {
          throw new BadRequestError("Image not provided");
        }
      });
    }
  }

  await Promise.all(
    Object.keys(payload.shipped_details)
      .filter((key) => key.startsWith("item_image["))
      .map(async (key) => {
        const file = payload.shipped_details[key];

        if (!file) {
          throw new BadRequestError(`File ${key} not provided`);
        }

        await validateFileService({ image: file });

        const uploadFile = await createFileService({
          image: file,
          folder_name: "shipped",
        });
        if (!uploadFile) {
          throw new BadRequestError("Cannot upload file, please try again");
        }

        const imageShipped = await createShippedOrderImageData({
          order_status_id: createOrderStatus.order_status_id,
          order_status_image: uploadFile.url,
        });

        if(!imageShipped) {
          throw new BadRequestError("Cannot create image shipped");
        }
      })
  );

  payload.shipped_details.order_id = order.order_id;

  const createDelivery = await createDeliveryData({delivery_details: payload.shipped_details});

  if(!createDelivery){
    throw new BadRequestError("Cannot create delivery details");
  }

  const sendNotification = await sendNotificationService({action: "SHIPPED", order_number: order.order_number, user_receiver_id: order.user_id , user_sender_id: user.user_id })

  if(!sendNotification) {
    return new BadRequestError("Failed to send notification");
  }

  return createDelivery;
}
