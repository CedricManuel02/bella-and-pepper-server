import { PrismaClient } from "@prisma/client";
import type { ICheckout, IInformation, ILocation } from "../../interfaces/interface.js";
import type { Status } from "../../utils/enum.js";

const prisma = new PrismaClient();

export async function getAllOrdersData() {
  const orders = await prisma.tbl_orders.findMany({
    orderBy: { order_date_created: "desc" },
    include: {
      tbl_items: true,
      tbl_order_status: {
        orderBy: {
          order_status_date_created: "desc",
        },
      },
      tbl_order_payment: true,
      tbl_users: true,
      tbl_order_information: true,
      tbl_shipping_fee: true,
    },
  });
  return orders;
}
//CREATE PRODUCT ORDER
export async function createOrderData(payload: {
  information: IInformation;
  checkout: ICheckout[];
  location: ILocation;
  payment_unique_id: string;
  status: Status;
  user_id: string;
  order_number: string;
  shipping_fee_id: string;
  shipping_fee_rate: number;
  order_target_date_received: Date;
}) {
  const { user_location, delivery_location } = payload.location;

  const order = await prisma.tbl_orders.create({
    data: {
      user_id: payload.user_id,
      order_number: payload.order_number,
      shipping_fee_id: payload.shipping_fee_id,
      order_shipping_fee: payload.shipping_fee_rate,
      order_target_date_received: payload.order_target_date_received,
      order_policy_aggreement: payload.information.order_policy_aggreement,
      tbl_order_payment: {
        create: {
          payment_unique_id: payload.payment_unique_id,
        },
      },
      tbl_order_information: {
        create: {
          order_information_first_name: payload.information.firstname,
          order_information_last_name: payload.information.lastname,
          order_information_email: payload.information.email,
          order_information_phone: payload.information.phone,
          order_address_barangay: payload.information.barangay,
          order_address_cities: payload.information.cities,
          order_address_complete: payload.information.address,
          order_address_province: payload.information.province,
          order_information_user_latitude: user_location.latitude.toString(),
          order_information_user_longitude: user_location.longitude.toString(),
          order_information_delivery_longitude: delivery_location.longitude.toString(),
          order_information_delivery_latitude: delivery_location.latitude.toString(),
        },
      },
      tbl_items: {
        create: payload.checkout.map((item: any) => ({
          variant_id: item.tbl_variants.variant_id,
          item_product_name: item.tbl_products.product_name,
          item_variant_name: item.tbl_variants.variant_name,
          item_quantity: item.quantity,
          product_id: item.tbl_products.product_id,
          item_product_image: item.tbl_variants.variant_image_url,
          item_product_variant: item.tbl_variants.variant_name,
          item_product_price_at_time_purchase: Number(item.tbl_variants.variant_price),
        })),
      },
      tbl_order_status: {
        create: {
          status: payload.status,
        },
      },
    },
    include: {
      tbl_items: true,
      tbl_order_status: true,
      tbl_order_payment: true,
      tbl_order_information: true,
    },
  });

  return order;
}
// GET THE ORDER BY ORDER NUMBER
export async function getOrder(payload: { order_number: string }) {
  const order = await prisma.tbl_orders
    .count({
      where: { order_number: payload.order_number },
    })
    .then((count) => count > 0);

  return order;
}
export async function getOrderByOrderNumber(payload: { order_number: string }) {
  const order = await prisma.tbl_orders.findFirst({
    where: {
      order_number: payload.order_number,
    },
  });

  return order;
}
export async function getUserOrdersData(payload: { user_id: string }) {
  const order = await prisma.tbl_orders.findMany({
    where: {
      user_id: payload.user_id,
    },
    orderBy: {
      order_date_created: "desc",
    },
    include: {
      tbl_items: true,
      tbl_order_information: true,
      tbl_order_payment: true,
      tbl_order_status: {
        orderBy: {
          order_status_date_created: "desc",
        }
      },
      tbl_shipping_fee: true,
    },
  });

  return order;
}
export async function getUserOrderData(payload: { order_id: string; }) {
  const order = await prisma.tbl_orders.findFirst({
    where: {
      order_id: payload.order_id,
    },
    include: {
      tbl_items: true,
      tbl_delivery_information: true,
      tbl_order_information: true,
      tbl_order_payment: true,
      tbl_order_status: {
        orderBy: {
          order_status_date_created: "desc",
        }
      },
      tbl_cancelled_order: true,
      tbl_rating: true,
      tbl_shipping_fee: true,
    },
  });

  return order;
}
export async function geOrderItemData(payload: { order_id: string }) {
  const order = await prisma.tbl_orders.findFirst({
    where: {
      order_id: payload.order_id,
    },
    include: {
      tbl_items: {
        include: {
          tbl_variant: {
            include: {
              tbl_products: true,
            },
          },
        },
      },
      tbl_order_information: true,
      tbl_order_payment: true,
      tbl_users: true,
      tbl_order_status: {
        orderBy: {
          order_status_date_created: "asc",
        },
        include: {
          tbl_order_status_images: true,
        },
      },
      tbl_shipping_fee: true,
    },
  });

  return order;
}
export async function getOrderByPaymentIntentData(payload: { payment_unique_id: string }) {
  const order = await prisma.tbl_orders.findFirst({
    where: {
      tbl_order_payment: {
        payment_unique_id: payload.payment_unique_id,
      },
    },
    include: {
      tbl_order_payment: true,
      tbl_items: true,
    },
  });

  return order;
}
export async function getOrderByPaymentIdData({ payment_id }: { payment_id: string }) {
  const order = await prisma.tbl_orders.findFirst({
    where: {
      tbl_order_payment: { 
        payment_unique_id: payment_id
       },
    },
    include: {
      tbl_order_payment: true,
      tbl_items: true,
    },
  });

  return order;
}
export async function updateOrderData(payload: {
  order_id: string;
  payment_status: string;
  payment_date_paid: Date;
  payment_method: string;
  payment_intent_id: string;
}) {

  const order = await prisma.tbl_orders.update({
    where: {
      order_id: payload.order_id,
    },
    data: {
      // Update the order payment details
      tbl_order_payment: {
        update: {
          payment_intent_id: payload.payment_intent_id,
          payment_method: payload.payment_method,
          payment_status: payload.payment_status,
          payment_date_paid: payload.payment_date_paid,
        },
      },
      tbl_order_status: {
          create: {
            status: "PAID", 
          },
      },
    },
    include: {
      tbl_order_payment: true,
      tbl_order_status: true, 
    },
  });

  return order;
}

// CREATE ORDER STATUS DATA
export async function createOrderStatusData({ status, order_id }: { status: Status; order_id: string }) {
  const order = await prisma.tbl_order_status.create({ data: { order_id: order_id, status: status } });
  return order;
}
