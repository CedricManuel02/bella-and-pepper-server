import { Hono } from "hono";
import { confirmAccountController, createForgotPasswordController, getAccountController, getVerificationTokenController, loginAccountController, registerAccountController, resetPasswordController, resetProfilePasswordController, signOutAccountController} from "./index.js";
import { authenticationMiddlewares } from "../../middlewares/authentication-middleware.js";

const router = new Hono()
  .post("/auth/login", loginAccountController)
  .post("/auth/register", registerAccountController)
  .post("/auth/signout", authenticationMiddlewares, signOutAccountController)
  .get("/auth/account", authenticationMiddlewares, getAccountController)
  .post("/auth/forgot-password", createForgotPasswordController)
  .get("/auth/verification-token/:token", getVerificationTokenController)
  .post("/auth/reset-password/:token", resetPasswordController)
  .post("/auth/reset-profile-password", authenticationMiddlewares, resetProfilePasswordController)
  .get("/auth/confirm-account/:token", confirmAccountController)

export default router;
