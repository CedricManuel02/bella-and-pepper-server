import { PrismaClient } from "@prisma/client";
import type { IAccount } from "../../interfaces/interface.js";
import { BadRequestError } from "../../utils/error.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function loginAccountData({ user_email, user_password }: { user_email: string; user_password: string }) {
  const user = await prisma.tbl_users.findUnique({
    where: { user_email: user_email },
  });

  if (!user) {
    throw new BadRequestError("Invalid Credentials");
  }

  const password_match = await bcrypt.compare(user_password, user.user_password);

  if (!password_match) {
    throw new BadRequestError("Invalid Credentials");
  }

  if(user.user_is_verified !== null) throw new BadRequestError("Please confirm your account, check your email");

  return user;
}

export async function registerAccountData({ user_is_verified, user_email, user_name, user_password }: IAccount) {
  const user_exist = await prisma.tbl_users.findUnique({
    where: { user_email: user_email },
  });

  if (user_exist) {
    throw new BadRequestError("Email is already taken");
  }

  const user = await prisma.tbl_users.create({
    data: {
      roles: "USER",
      user_name,
      user_email,
      user_password,
      user_is_verified,
    },
  });

  return user;
}

export async function getUserByTokenData(confirm_token_hash: string) {
  const user = await prisma.tbl_users.findFirst({
    where: {
      user_is_verified: confirm_token_hash
    }
  });

  return user;
}
export async function deleteUserTokenData(user_id: string) {
  const user = await prisma.tbl_users.update({
    data: {
      user_is_verified: null,
    },
    where: {
      user_id
    }
  });

  return user;
}

export async function updateAccountPasswordData({ user_id, user_password }: { user_id: string; user_password: string }) {
  const user = await prisma.tbl_users.update({
    data: {
      user_password,
    },
    where: {
      user_id,
    },
  });

  return user;
}

export async function resetPasswordAccountData({ new_password, user_id }: { new_password: string; user_id: string }) {
  const user = await prisma.tbl_users.update({
    data: {
      user_password: new_password,
    },
    where: {
      user_id,
    },
  });

  return user;
}

export async function getAdminAccountData() {
  const account = await prisma.tbl_users.findFirst({
    where: {
      roles: "ADMIN",
    },
  });

  return account?.user_id;
}

export async function getUserByEmailData(user_email: string) {
  const user = await prisma.tbl_users.findUnique({
    where: {
      user_email,
    },
  });

  return user;
}

export async function createResetTokenData({ reset_token_hash, user_id, reset_token_expires_at }: any) {
  console.log(reset_token_hash, user_id, reset_token_expires_at);
  const reset_token = await prisma.tbl_reset_token.create({
    data: {
      user_id,
      reset_token_hash,
      reset_token_expires_at,
    },
  });

  return reset_token;
}

export async function getResetTokenByUserIdData(user_id: string) {
  const reset_token = await prisma.tbl_reset_token.findFirst({
    where: {
      user_id,
    },
  });

  return reset_token;
}

export async function getResetTokenData(reset_token_hash: string) {
  const reset_token = await prisma.tbl_reset_token.findFirst({
    where: {
      reset_token_hash,
    },
  });

  return reset_token;
}

export async function deleteResetTokenData(reset_token_id: string) {
  const reset_token = await prisma.tbl_reset_token.delete({
    where: {
      reset_token_id,
    },
  });

  return reset_token;
}
