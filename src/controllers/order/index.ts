import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import {
  cancelledOrderService,
  deleteOrderService,
  getAllOrdersService,
  getOrderItemService,
  getOrderService,
  getOrdersService,
  receivedOrderService,
} from "../../services/order/index.js";

// GET ALL ORDER
export async function getAllOrdersController(c: Context) {
  const orders = await getAllOrdersService();
  return c.json({ orders: orders, status: StatusCodes.OK });
}
// GET ALL ORDER BASE ON USER ID
export async function getOrdersController(c: Context) {
  const user_id = c.get("user_id");

  const order = await getOrdersService({ user_id });

  return c.json({ order: order, status: StatusCodes.OK });
}

export async function getOrderController(c: Context) {
  const { order_id } = await c.req.param();

  const user_id = c.get("user_id");

  const order = await getOrderService({ order_id: order_id, user_id: user_id });

  return c.json({ order: order, status: StatusCodes.OK });
}

export async function getOrderItemController(c: Context) {
  const { order_id } = await c.req.param();

  const order = await getOrderItemService({ order_id: order_id });

  return c.json({ order: order, status: StatusCodes.OK });
}

export async function createOrderCancellationController(c: Context) {
  const { order_number } = await c.req.param();

  const user_id = c.get("user_id");

  const body = await c.req.json();

  return c.json({
    message: "Successfully canceled order",
    status: StatusCodes.OK,
  });
}

// ? ORDER ACTION SUCH AS RECEIVED , SHIPPED , CANCELLED

// RECEIVED ORDER CONTROLLER
export async function receivedOrderController(c: Context) {
  const { order_id } = await c.req.param();

  const user_id = c.get("user_id");

  await receivedOrderService({ order_id: order_id, user_id: user_id });

  return c.json({
    message: "Successfully updated order",
    status: StatusCodes.OK,
  });
}

// CANCELLED ORDER CONTROLLER
export async function cancelledOrderController(c: Context) {
  const { order_id } = await c.req.param();

  const user_id = c.get("user_id");

  const body = await c.req.json();

  await cancelledOrderService({
    order_id: order_id,
    user_id: user_id,
    reason: body["reason"],
  });

  return c.json({
    message: "Successfully cancelled order",
    status: StatusCodes.ACCEPTED,
  });
}
export async function deleteOrderController(c: Context) {
  const { session_id } = await c.req.param();

  const user_id = c.get("user_id");

  await deleteOrderService({
    session_id,
    user_id
  });

  return c.json({
    message: "Successfully delete order",
    status: StatusCodes.ACCEPTED,
  });
}
