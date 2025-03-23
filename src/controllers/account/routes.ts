import { Hono } from "hono";
import { createForgotPasswordController, getAccountController, getVerificationTokenController, loginAccountController, registerAccountController, resetPasswordController, signOutAccountController} from "./index.js";
import { authenticationMiddlewares } from "../../middlewares/authentication-middleware.js";

const router = new Hono()
  .post("/auth/login", loginAccountController)
  .post("/auth/register", registerAccountController)
  .post("/auth/signout", authenticationMiddlewares, signOutAccountController)
  .get("/auth/account", authenticationMiddlewares, getAccountController)
  .post("/auth/forgot-password", createForgotPasswordController)
  .get("/auth/verification-token/:token", getVerificationTokenController)
  .post("/auth/reset-password/:token", resetPasswordController)

export default router;
