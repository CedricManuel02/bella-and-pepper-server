import { Hono } from "hono";
import { userAuthenticationMiddlewares } from "../../middlewares/user-authentication-handler.js";
import { cancelledOrderController, createOrderCancellationController, getAllOrdersController, getOrderController, getOrderItemController, getOrdersController, receivedOrderController } from "./index.js";
import { adminAuthenticationMiddlewares } from "../../middlewares/admin-authentication-handler.js";

const router = new Hono()
.get("/auth/order", userAuthenticationMiddlewares, getOrdersController)
.get("/auth/order/:order_id",userAuthenticationMiddlewares, getOrderController)
.get("/auth/item/order/:order_id", adminAuthenticationMiddlewares, getOrderItemController)
.get("/auth/orders", adminAuthenticationMiddlewares, getAllOrdersController)
.post("/auth/order/:order_id", userAuthenticationMiddlewares, createOrderCancellationController)
.put("/auth/order/received/:order_id", userAuthenticationMiddlewares, receivedOrderController)
.post("/auth/order/cancelled/:order_id", userAuthenticationMiddlewares, cancelledOrderController)

export default router;