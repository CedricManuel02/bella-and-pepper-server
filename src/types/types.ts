import type { Status } from "../utils/enum.js";

export type TNotification = {
  action: Status;
  order_id?: string;
  order_number?: string;
  product_name?: string;
  user_name?: string;
  user_sender_id?: string;
  user_receiver_id?: string;
};

