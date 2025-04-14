import type { Status } from "@prisma/client";
import type { Role } from "../utils/enum.js";

export type TNotification = {
  action: Status;
  order_id?: string;
  order_number?: string;
  product_name?: string;
  user_name?: string;
  user_sender_id?: string;
  user_receiver_id?: string;
};

type TAccountConfirmPassword = {
  confirm_password?: string;
}

export type TAccount = TAccountConfirmPassword  &{
  user_id: string;
  user_name?: string;
  user_phone?: string;
  user_email?: string;
  roles?: Role;
  user_password?: string;
  user_profile?: string | File;
};
