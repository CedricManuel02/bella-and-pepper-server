import { Hono } from "hono";
import { userAuthenticationMiddlewares } from "../../middlewares/user-authentication-handler.js";
import { createCartController, deleteCartController, getCartController, updateCartController } from "./index.js";

const router = new Hono()
  .use("/auth/cart/*", userAuthenticationMiddlewares)
  .get("/auth/cart", getCartController)
  .post("/auth/cart", createCartController)
  .delete("/auth/cart/:cart_id", deleteCartController)
  .put("/auth/cart/:cart_id", updateCartController);

export default router;
