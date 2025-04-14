import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../../utils/error.js";
import { DEFAULT_ACCOUNT_ROLE } from "../../constant/constant.js";
import type {
  TAccountBase,
  TAccountChangePassword,
  TAccountEmail,
  TAccountRegister,
  TAccountUpdatePassword,
  TUpdateAccount,
} from "../../types/account.types.js";
import type { TAccountResetToken, TAccountResetTokenBase, TAccountResetTokenHash } from "../../types/token.types.js";

const prisma = new PrismaClient();

// GET ACCOUNT BY EMAIL DATA (USE FOR LOGIN PURPOSE)
export async function getAccountByEmailData({ user_email }: TAccountEmail) {
  try {
    const user = await prisma.tbl_users.findUnique({ where: { user_email } });
    return user;
  } catch (error) {
    console.error("Something went wrong while getting account by email data:", error);
    throw new BadRequestError("Something went wrong while getting account by email data");
  }
}
// REGISTRATION ACCOUNT DATA
export async function registerAccountData({ user_is_verified, user_email, user_name, user_password }: TAccountRegister) {
  try {
    const isUserExisting = await prisma.tbl_users.findUnique({ where: { user_email } });

    if (isUserExisting) throw new BadRequestError("Email is already taken");

    const user = await prisma.tbl_users.create({
      data: {
        roles: DEFAULT_ACCOUNT_ROLE,
        user_name,
        user_email,
        user_password,
        user_is_verified,
      },
    });

    return user;
  } catch (error) {
    console.error("Account registration error:", error);
    throw new BadRequestError("Unable to process account registration");
  }
}
// GET ACCOUNT BY VERIFICATION HASH
export async function getAccountByVerificationHashData(confirm_token_hash: string) {
  try {
    const user = await prisma.tbl_users.findFirst({ where: { user_is_verified: confirm_token_hash } });
    return user;
  } catch (error) {
    console.error("Get user by token error:", error);
    throw new BadRequestError("Unable to get user by token");
  }
}
// CLEAR ACCOUNT VERIFICATION STATUS DATA
export async function clearAccountVerificationStatusData({ user_id }: TAccountBase) {
  try {
    const user = await prisma.tbl_users.update({ data: { user_is_verified: null }, where: { user_id } });
    return user;
  } catch (error) {
    console.error("Error clearing user verification status:", error);
    throw new BadRequestError("Unable to clear user verification status");
  }
}
// UPDATE ACCOUNT PASSWORD DATA
export async function updateAccountPasswordData({ user_id, user_password }: TAccountUpdatePassword) {
  try {
    const user = await prisma.tbl_users.update({
      data: { user_password },
      where: { user_id },
    });

    return user;
  } catch (error) {
    console.error("Update account password error:", error);
    throw new BadRequestError("Unable to update account password");
  }
}
// RESET ACCOUNT PASSWORD DATA
export async function resetAccountPasswordData({ new_password, user_id }: TAccountChangePassword) {
  try {
    const user = await prisma.tbl_users.update({
      data: { user_password: new_password },
      where: { user_id },
    });

    return user;
  } catch (error) {
    console.error("Reset password account error:", error);
    throw new BadRequestError("Unable to process account password reset");
  }
}
// GET ADMIN ACCOUNT DATA (NOTIFICATION PURPOSE)
export async function getAdminAccountData() {
  try {
    const account = await prisma.tbl_users.findFirst({ where: { roles: "ADMIN" }, select: { user_id: true } });

    return account?.user_id;
  } catch (error) {
    console.error("Error getting admin account:", error);
    throw new BadRequestError("Unable to get admin account");
  }
}
// GET USER BY EMAIL DATA
export async function getUserByEmailData(user_email: string) {
  try {
    const user = await prisma.tbl_users.findUnique({ where: { user_email } });
    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw new BadRequestError("Unable to get user by email");
  }
}
// CREATING RESET TOKEN DATA (PASSWORD RESET)
export async function createResetPasswordTokenData({ reset_token_hash, user_id, reset_token_expires_at }: TAccountResetToken) {
  try {
    const resetToken = await prisma.tbl_reset_token.create({
      data: {
        user_id,
        reset_token_hash,
        reset_token_expires_at,
      },
    });
    return resetToken;
  } catch (error) {
    console.error("Error creating reset token:", error);
    throw new BadRequestError("Unable to create reset token");
  }
}
// GET RESET TOKEN BY USER ID
export async function getResetTokenByUserIdData({ user_id }: TAccountBase) {
  try {
    const resetToken = await prisma.tbl_reset_token.findFirst({ where: { user_id } });

    return resetToken;
  } catch (error) {
    console.error("Error getting reset token by user id:", error);
    throw new BadRequestError("Unable to get reset token by user id");
  }
}
// GET RESET TOKEN DATA
export async function getResetTokenData({ reset_token_hash }: TAccountResetTokenHash) {
  try {
    const resetToken = await prisma.tbl_reset_token.findFirst({
      where: {
        reset_token_hash,
      },
    });

    return resetToken;
  } catch (error) {
    console.error("Error getting reset token:", error);
    throw new BadRequestError("Unable to get reset token");
  }
}
// DELETE RESET TOKEN
export async function deleteResetTokenData({ reset_token_id }: TAccountResetTokenBase) {
  try {
    const resetToken = await prisma.tbl_reset_token.delete({ where: { reset_token_id } });
    return resetToken;
  } catch (error) {
    console.error("Error deleting reset token:", error);
    throw new BadRequestError("Unable to delete reset token");
  }
}
// UPDATING ACCOUNT DATA (USE IF USER IS AUTHENTICATED)
export async function updateAccountData({ account, user_id }: { account: any; user_id: string }) {
  try {
    const user = await prisma.tbl_users.update({
      data: { ...account },
      where: {
        user_id,
      },
      select: {
        user_name: true,
        user_profile: true,
        user_phone: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error updating account:", error);
    throw new BadRequestError("Unable to update account");
  }
}
// DELETING ACCOUNT IMAGE
export async function deleteAccountImageData({ user_id }: TAccountBase) {
  try {
    const user = await prisma.tbl_users.update({
      data: { user_profile: null },
      where: { user_id },
    });

    return user;
  } catch (error) {
    console.error("Error deleting account image:", error);
    throw new BadRequestError("Unable to delete account image");
  }
}
