import type { Context } from "hono";
import { createForgotPasswordService, getAccountService, getVerificationTokenService, loginAccountService, registerAccountService, resetPasswordService, resetProfilePasswordService, signOutAccountService } from "../../services/account/index.js";
import { StatusCodes } from "http-status-codes";
import { deleteCookie, getCookie } from "hono/cookie";
export async function loginAccountController(c: Context) {
  const { user_email, user_password } = await c.req.json();

  const {user, session_token} = await loginAccountService({ user_email, user_password, c });
  
  return c.json({ data: user, token: session_token, status: StatusCodes.OK });
}

export async function registerAccountController(c: Context) {
  const body = await c.req.json();

  await registerAccountService(body);

  return c.json({ message: "Successfully registered your account", status: StatusCodes.CREATED });
}

export async function getAccountController(c: Context) {
  const user_id = c.get("user_id");

  const {user, access_token} = await getAccountService(user_id);

  return c.json({data: user, token: access_token, status: StatusCodes.OK})
}

export async function signOutAccountController(c: Context) {
  const user_id = c.get("user_id");
  
  await signOutAccountService(user_id);

  deleteCookie(c, "auth__token");

  return c.json({message: "Successfully signout", status: StatusCodes.OK})
}

export async function createForgotPasswordController(c: Context) {
  const body = await c.req.json();

  await createForgotPasswordService(body)

  return c.json({message: "We send to your email for resetting your password", status: StatusCodes.CREATED});
}

export async function getVerificationTokenController(c: Context) {
  const {token} = await c.req.param();

  await getVerificationTokenService(token)

  return c.json({message: "We send to your email for resetting your password", status: StatusCodes.CREATED});
}

export async function resetPasswordController(c: Context) {
  const {token} = await c.req.param();
  const body = await c.req.json();

  const new_password = body["new_password"];
  const confirm_password = body["confirm_password"];

  await resetPasswordService({new_password, confirm_password ,reset_token: token})

  return c.json({message: "Successfully change password", status: StatusCodes.CREATED});
}

export async function resetProfilePasswordController(c: Context) {
  const user_id = c.get("user_id")

  const body = await c.req.json();

  const {user_password, new_password, confirm_password} = body

  await resetProfilePasswordService({user_id, user_password, new_password, confirm_password});

  return c.json({message: "Successfully change password", status: StatusCodes.ACCEPTED});
}