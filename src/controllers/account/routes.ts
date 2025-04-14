import { Hono } from "hono";
import { confirmAccountController, createResetPasswordController, deleteImageProfileController, getAccountController, getVerificationTokenController, loginAccountController, registerAccountController, resetPasswordController, resetAccountPasswordController, signOutAccountController, updateAccountController} from "./index.js";
import { authenticationMiddlewares } from "../../middlewares/authentication-middleware.js";
import { fileUploadMiddleware } from "../../middlewares/file-upload-handler.js";

const router = new Hono()
  .use("/auth/file/*", fileUploadMiddleware)
  .post("/auth/login", loginAccountController)
  .post("/auth/register", registerAccountController)
  .post("/auth/signout", authenticationMiddlewares, signOutAccountController)
  .get("/auth/account", authenticationMiddlewares, getAccountController)
  .post("/auth/forgot-password", createResetPasswordController)
  .get("/auth/verification-token/:token", getVerificationTokenController)
  .post("/auth/reset-password/:token", resetPasswordController)
  .post("/auth/reset-profile-password", authenticationMiddlewares, resetAccountPasswordController)
  .get("/auth/confirm-account/:token", confirmAccountController)
  .post("/auth/file/update-profile", authenticationMiddlewares, updateAccountController)
  .put("/auth/file/delete-profile-image", authenticationMiddlewares, deleteImageProfileController)

export default router;
