import type { Context } from "hono";
import {
  createForgotPasswordService,
  deleteImageProfileService,
  getAccountService,
  getVerificationEmailTokenService,
  getVerificationTokenService,
  loginAccountService,
  registerAccountService,
  resetPasswordService,
  resetProfilePasswordService,
  signOutAccountService,
  updateProfileService,
} from "../../services/account/index.js";
import { StatusCodes } from "http-status-codes";
import { deleteCookie } from "hono/cookie";
import { BadRequestError } from "../../utils/error.js";
import type { TAccount } from "../../types/types.js";

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
    console.error(
      "Something went wrong while logging in account conrtoller:",
      error
    );
    throw new BadRequestError(
      "Something went wrong while logging in account conrtoller"
    );
  }
}

export async function registerAccountController(c: Context) {
  try {
    const body = await c.req.json();

    await registerAccountService(body);

    return c.json({
      message:
        "Successfully registered your account, please check your email to confirm your account",
      status: StatusCodes.CREATED,
    });
  } catch (error) {
    console.error(
      "Something went wrong while registering in account conrtoller:",
      error
    );
    throw new BadRequestError(
      "Something went wrong while registering in account conrtoller"
    );
  }
}

export async function getAccountController(c: Context) {
  try {
    const user_id = c.get("user_id");

    const { user, accessToken } = await getAccountService(user_id);

    return c.json({ data: user, token: accessToken, status: StatusCodes.OK });
  } catch (error) {}
}

export async function signOutAccountController(c: Context) {
  const user_id = c.get("user_id");

  await signOutAccountService(user_id);

  deleteCookie(c, "auth__token");

  return c.json({ message: "Successfully signout", status: StatusCodes.OK });
}

export async function createForgotPasswordController(c: Context) {
  const body = await c.req.json();

  await createForgotPasswordService(body);

  return c.json({
    message: "We send to your email for resetting your password",
    status: StatusCodes.CREATED,
  });
}

export async function getVerificationTokenController(c: Context) {
  const { token } = await c.req.param();

  await getVerificationTokenService(token);

  return c.json({
    message: "We send to your email for resetting your password",
    status: StatusCodes.CREATED,
  });
}

export async function resetPasswordController(c: Context) {
  const { token } = await c.req.param();
  const body = await c.req.json();

  const new_password = body["new_password"];
  const confirm_password = body["confirm_password"];

  await resetPasswordService({
    new_password,
    confirm_password,
    reset_token: token,
  });

  return c.json({
    message: "Successfully change password",
    status: StatusCodes.CREATED,
  });
}

export async function resetProfilePasswordController(c: Context) {
  const user_id = c.get("user_id");

  const body = await c.req.json();

  const { user_password, new_password, confirm_password } = body;

  await resetProfilePasswordService({
    user_id,
    user_password,
    new_password,
    confirm_password,
  });

  return c.json({
    message: "Successfully change password",
    status: StatusCodes.ACCEPTED,
  });
}

export async function confirmAccountController(c: Context) {
  const { token } = await c.req.param();
  await getVerificationEmailTokenService(token);
  return c.json({
    message: "Successfully confirm your account",
    status: StatusCodes.ACCEPTED,
  });
}
export async function updateProfileController(c: Context) {
  const user_id = c.get("user_id");

  const body = await c.req.parseBody();

  const updatedUser = await updateProfileService({ user_id, account: body });

  return c.json({
    message: "Successfully Updated your profile",
    data: updatedUser,
    status: StatusCodes.ACCEPTED,
  });
}

export async function deleteImageProfileController(c: Context) {
  const user_id = c.get("user_id");

  await deleteImageProfileService({ user_id });

  return c.json({
    message: "Successfully remove your image",
    status: StatusCodes.OK,
  });
}
