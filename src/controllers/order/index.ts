import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import {
  cancelledOrderService,
  deleteOrderService,
  generateSalesReportService,
  getAllOrdersService,
  getOrderByCheckoutSessionService,
  getOrderItemService,
  getOrderService,
  getOrdersService,
  receivedOrderService,
} from "../../services/order/index.js";
import { getAllOrdersData } from "../../data/order/index.js";

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

// DELETE ORDER CONTROLLER (USED FOR CANCELLED ORDER CHECKOUT AND RUN AN EXPIRATION FUNCTION)
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

// GENERATE SALES REPORT CONTROLLER
export async function generateSalesReportController(c: Context) {
  const body = await c.req.json();

  const { start_date, end_date } = body;

  const data = await generateSalesReportService({start_date, end_date});

  return c.json({
    data,
    message: "Successfully generated sales report",
    status: StatusCodes.OK,
  });
}

export async function getOrderByCheckoutSessionController(c: Context) {
  const { session_id } = await c.req.param();
  const user_id = c.get("user_id");

  await getOrderByCheckoutSessionService({session_id, user_id});
  return c.json({message: "Successfully checkout", status: StatusCodes.OK});
}