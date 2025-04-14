import type { Context } from "hono";
import {
  createResetPasswordService,
  deleteImageAccountService,
  getAccountService,
  getVerificationEmailTokenService,
  getVerificationTokenService,
  loginAccountService,
  registerAccountService,
  resetPasswordService,
  resetAccountPasswordService,
  signOutAccountService,
  updateAccountService,
} from "../../services/account/index.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../utils/error.js";

// LOGIN ACCOUNT CONTROLLER
export async function loginAccountController(c: Context) {
  try {
    const { user_email, user_password } = await c.req.json();

    const { user, sessionToken } = await loginAccountService({
      user_email,
      user_password,
    });

    return c.json({ data: user, token: sessionToken, status: StatusCodes.OK });
  } catch (error) {
    console.error("Something went wrong while logging in account conrtoller:", error);
    throw new BadRequestError("Something went wrong while logging in account conrtoller");
  }
}
// REGISTER ACCOUNT CONTROLLER
export async function registerAccountController(c: Context) {
  try {
    const body = await c.req.json();

    await registerAccountService(body);

    return c.json({
      message: "Successfully registered your account, please check your email to confirm your account",
      status: StatusCodes.CREATED,
    });
  } catch (error) {
    console.error("Something went wrong while registering in account conrtoller:", error);
    throw new BadRequestError("Something went wrong while registering in account conrtoller");
  }
}
// GET ACCOUNT CONTROLLER
export async function getAccountController(c: Context) {
  try {
    const user_id = c.get("user_id");

    const { user, accessToken } = await getAccountService(user_id);

    return c.json({ data: user, token: accessToken, status: StatusCodes.OK });
  } catch (error) {
    console.error("Something went wrong while getting account controller:", error);
    throw new BadRequestError("Something went wrong while getting account controller");
  }
}
// SIGNOUT ACCOUNT CONTROLLER
export async function signOutAccountController(c: Context) {
  const user_id = c.get("user_id");

  await signOutAccountService(user_id);

  return c.json({ message: "Successfully signout", status: StatusCodes.OK });
}
export async function createResetPasswordController(c: Context) {
  try {
    const body = await c.req.json();

    await createResetPasswordService(body);

    return c.json({
      message: "We send to your email for resetting your password",
      status: StatusCodes.CREATED,
    });
  } catch (error) {
    console.error("Something went wrong while create forgot password controller:", error);
    throw new BadRequestError("Something went wrong while create forgot password controller");
  }
}
// GET VERIFICATION TOKEN CONTROLLER (VERIFY TOKEN IN EMAIL LINK)
export async function getVerificationTokenController(c: Context) {
  try {
    const { token } = await c.req.param();

    await getVerificationTokenService({reset_token: token});

    return c.json({
      message: "We send to your email for resetting your password",
      status: StatusCodes.CREATED,
    });
  } catch (error) {
    console.error("Something went wrong while getting verification token controller:", error);
    throw new BadRequestError("Something went wrong while getting verification token controller");
  }
}
// RESET PASSWORD CONTROLLER (USE IN EMAIL FORGOT PASSWORD)
export async function resetPasswordController(c: Context) {
  try {
    const body = await c.req.json();
    const { token } = await c.req.param();

    await resetPasswordService({
      new_password: body["new_password"],
      confirm_password: body["confirm_password"],
      reset_token: token,
    });

    return c.json({
      message: "Successfully change your password",
      status: StatusCodes.CREATED,
    });
  } catch (error) {
    console.error("Something went wrong while reset password controller:", error);
    throw new BadRequestError("Something went wrong while reset password controller");
  }
}
// RESET PROFILE PASSWORD CONTROLLER (USE IF AUTHENTICATED)
export async function resetAccountPasswordController(c: Context) {
  try {
    const user_id = c.get("user_id");

    const body = await c.req.json();

    const { user_password, new_password, confirm_password } = body;

    await resetAccountPasswordService({
      user_id,
      user_password,
      new_password,
      confirm_password,
    });

    return c.json({
      message: "Successfully change your password",
      status: StatusCodes.CREATED,
    });
  } catch (error) {
    console.error("Something went wrong while reset profile password controller:", error);
    throw new BadRequestError("Something went wrong while reset profile password controller");
  }
}
// CONFIRM ACCOUNT CONTROLLER
export async function confirmAccountController(c: Context) {
  try {
    const { token } = await c.req.param();

    await getVerificationEmailTokenService({reset_token: token});

    return c.json({
      message: "Successfully confirmed your account",
      status: StatusCodes.ACCEPTED,
    });
  } catch (error) {
    console.error("Something went wrong while confirm account controller:", error);
    throw new BadRequestError("Something went wrong while confirm account controller");
  }
}
// UPDATE PROFILE CONTROLLER
export async function updateAccountController(c: Context) {
  try {
    const user_id = c.get("user_id");

    const account = await c.req.parseBody();

    const updateAccount = await updateAccountService({ user_id, account });

    return c.json({
      message: "Successfully Updated your profile",
      data: updateAccount,
      status: StatusCodes.ACCEPTED,
    });
  } catch (error) {
    console.error("Something went wrong while update profile controller:", error);
    throw new BadRequestError("Something went wrong while update profile controller");
  }
}
// DELETING IMAGE PROFILE CONTROLLER
export async function deleteImageProfileController(c: Context) {
  try {
    const user_id = c.get("user_id");

    await deleteImageAccountService({user_id});

    return c.json({
      message: "Successfully remove your image",
      status: StatusCodes.OK,
    });
  } catch (error) {
    console.error("Something went wrong while deleting image profile controller:", error);
    throw new BadRequestError("Something went wrong while deleting image profile controller");
  }
}
