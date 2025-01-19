import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { BadRequestError } from "../../utils/error.js";
import type { IAccount } from "../../interfaces/interface.js";
import { EMAIL_REGEX, MIN_PASSWORD_LENGTH, SALT_ROUND } from "../../constant/constant.js";
import {loginAccountData, registerAccountData} from "../../data/account/index.js";
dotenv.config();


export async function loginAccountService(payload: IAccount) {

  if (!payload.user_email || !payload.user_password) {
    throw new BadRequestError("All fields are required");
  }

  if (!EMAIL_REGEX.test(payload.user_email)) {
    throw new BadRequestError("Invalid email address");
  }

  await loginAccountData(payload);

  const token = await sign({ sub: payload.user_email, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, process.env.APP_SECRET_KEY as string);

  return token;
}

export async function registerAccountService(payload: IAccount) {
  
  if (!payload.user_name || !payload.user_email || !payload.user_password) {
    throw new BadRequestError("All fields are required");
  }

  if (!EMAIL_REGEX.test(payload.user_email)) {
    throw new BadRequestError("Invalid email address");
  }

  if (payload.user_password.length < MIN_PASSWORD_LENGTH) {
    throw new BadRequestError("Password must be at least 8 characters long");
  }

  payload.user_password = await bcrypt.hash(payload.user_password, SALT_ROUND)

  const registerData = await registerAccountData(payload);

  return registerData;
}
