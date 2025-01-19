import { PrismaClient } from "@prisma/client";
import type { IAccount } from "../../interfaces/interface.js";
import { BadRequestError } from "../../utils/error.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function loginAccountData(payload: IAccount) {
    
  const user = await prisma.tbl_user.findUnique({where: { user_email: payload.user_email }});

  if (!user) {
    throw new BadRequestError("Invalid Credentials");
  }

  const password_match = await bcrypt.compare(payload.user_password, user.user_password);

  if (!password_match) {
    throw new BadRequestError("Incorrect password");
  }

  return user;
}

export async function registerAccountData(payload: IAccount) {

  const user_exist  = await prisma.tbl_user.findUnique({where: { user_email: payload.user_email }});

  if(user_exist) {
    throw new BadRequestError("User email already exist")
  }
  
  const user = await prisma.tbl_user.create({
    data: {
      user_name: payload.user_name,
      user_email: payload.user_email,
      user_password: payload.user_password,
  }});

  return user;
}
