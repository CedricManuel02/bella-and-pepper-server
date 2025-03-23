import type { Status } from "../utils/enum.js";

export interface IAccount {
  roles?: string;
  user_name: string;
  user_email: string;
  user_password: string;
  user_confirm_password?: string;
}

export interface ICategory {
  category_id: string;
  category_name: string;
  category_image: string;
  category_date_created: Date;
  category_date_updated: Date | null;
  category_date_deleted: Date | null;
}

export interface IProduct {
  category_id: string;
  product_id?: string;
  product_upc_number: string;
  product_name: string;
  product_description: string;
  tbl_variants: IVariants[];
}

export interface ICheckout {
  tbl_products: IProduct;
  tbl_variants: IVariants;
  quantity: number;
}

export interface IUpdateProduct {
  product_id: string;
  category_id: string;
  product_upc_number: string;
  product_name: string;
  product_description: string;
  tbl_variants: IVariants[];
}

export interface IVariants {
  variant_id: string;
  product_id: string;
  variant_name: string;
  variant_price: number;
  variant_discount: number;
  variant_stocks: number;
  variant_image_url: string;
  variant_discount_end_date: Date;
  variant_date_created: Date;
  variant_date_updated: Date | null;
  variant_date_deleted: Date | null;
}

export interface IInformation {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  cities: string;
  barangay: string;
  order_policy_aggreement: boolean;
}

export interface ILocation {
  user_location: ICoordinates;
  delivery_location: ICoordinates;
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IPayment {
  payment_id?: string;
  order_id: string;
  payment_method?: string | null;
  payment_intent_id: string;
  payment_status: string;
  payment_date_paid?: Date | null;
  payment_date_created: Date;
}

export interface IDeliveryDetails {
  delivery_id?: string;
  order_id: string;
  delivery_company: string;
  delivery_rider_name: string;
  delivery_rider_phone: string;
  delivery_plate_number: string;
  delivery_tracking_number: string;
  item_image?: File[];
  [key: string]: any;
}

// ORDER INTERFACE

// NOTIFICATION INTERFACE
export interface INotification {
  notification_id?: string;
  notification_title: string;
  notification_body: string;
  user_sender_id: string;
  user_receiver_id: string;
  status: "PLACED_ORDER" | "CANCELLED" | "PAID" | "REFUNDED" | "RATING" | "APPROVED" | "SHIPPED" | "DELIVERED";
}

// ORDER INTERFACE SCHEMA

export interface IUsers {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_password: string;
  user_profile: string;
  user_is_verified: string;
  user_date_created: Date;
  user_date_updated: Date | null;
  reset_token_hash: string;
  reset_token_expires_at: Date;
}

export interface IOrderBase {
  order_id: string;
}
export interface IOrders extends IOrderBase {
  order_number: string;
  shipping_fee_id: string;
  order_date_created: Date;
  order_shipping_fee: number;
  order_target_date_received: Date;

  // RELATIONSHIP
  tbl_users: IUsers;
  tbl_order_information: IOrderInformation[];
  tbl_order_status: IOrderStatus[];
  tbl_shipping_fee: IShippingFee;
  tbl_order_payment: IOrderPayment;
  tbl_delivery_information: IOrderDeliveryInformation;
  tbl_items: IItems[];
}
// ORDER USER INFORMATION
export interface IOrderInformation extends IOrderBase {
  order_information_id: string;
  order_information_first_name: string;
  order_information_last_name: string;
  order_information_email: string;
  order_information_phone: string;
  order_address_barangay: string;
  order_address_cities: string;
  order_address_complete: string;
  order_address_province: string;
  order_information_user_latitude: number;
  order_information_user_longitude: number;
  order_information_delivery_latitude: number;
  order_information_delivery_longitude: number;
  order_policy_aggreement: boolean;
}

export interface IOrderStatus extends IOrderBase {
  order_status_id: string;
  status_id: string;
  order_status_date_created: Date;
  tbl_status: IStatus;
  tbl_order_status_images: IOrderStatusImages[];
}

export interface IStatus {
  status_id: string;
  status_name: string;
}

export interface IOrderStatusImages {
  order_status_image_id: string;
  order_status_id: string;
  order_status_image: string;
}

export interface IShippingFee {
  shipping_fee_id: string;
  province_id: string;
  province_name: string;
  shipping_fee_rate: number;
  shipping_fee_date_created: Date;
  shipping_fee_date_updated: Date | null;
  shipping_fee_date_deleted: Date | null;
  expected_shipping_days: number;
}

export interface IOrderPayment extends IOrderBase {
  payment_id: string;
  payment_method: string;
  payment_intent_id: string;
  payment_status: string;
  payment_date_paid: Date | null;
  payment_date_created: Date;
  payment_transaction_fee: number;
  payment_unique_id: string;
}

export interface IItems extends IOrderBase {
  item_id: string;
  variant_id: string;
  item_quantity: number;
  item_product_discount_at_time_purchase?: number | null;
  item_product_image: string;
  item_product_price_at_time_purchase: number;
  item_product_name: string;
  item_variant_name: string;
  item_product_variant: string;
  tbl_variants: IVariant;
  tbl_products: IProduct;
}

export interface IOrderDeliveryInformation extends IOrderBase {
  delivery_id: string;
  delivery_company: string;
  delivery_rider_name: string;
  delivery_rider_phone: string;
  delivery_plate_number: string;
  delivery_tracking_number: string;
  deliver_plate_number: string;
  delivery_date_created: Date;
}

export interface IMapBox {
  start: [number, number];
  destination: [number, number];
  barangay: string;
}

export interface ILocation {
  longitude: number;
  latitude: number;
  province: string;
  cities: string;
  barangay: string;
}

export interface IVariant {
  variant_name: string;
  variant_price: number;
  variant_stocks: number;
  variant_image: File | null;
}
