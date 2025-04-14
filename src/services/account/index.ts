import {
  createResetPasswordTokenData,
  deleteAccountImageData,
  deleteResetTokenData,
  clearAccountVerificationStatusData,
  getResetTokenByUserIdData,
  getResetTokenData,
  getUserByEmailData,
  getAccountByVerificationHashData,
  registerAccountData,
  resetAccountPasswordData,
  updateAccountPasswordData,
  updateAccountData,
} from "../../data/account/index.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sign } from "hono/jwt";
import { getUserData } from "../../data/user/index.js";
import { createGmailSendingService } from "../../utils/send-email.js";
import { BadRequestError, UnauthorizedError } from "../../utils/error.js";
import { createFileService, validateFileService } from "../file/index.js";
import { isUserExistingByEmailService, isUserExistingService } from "../user/index.js";
import { DecryptJWEToJWT, DeleteCloudinaryImage, EncryptJWTToJWE } from "../../utils/helper.js";
import { createSessionData, deleteSessionData, getSessionData } from "../../data/session/index.js";
import { EMAIL_REGEX, MIN_PASSWORD_LENGTH, PH_PHONE_REGEX, SALT_ROUND } from "../../constant/constant.js";
import type { TAccount, TAccountBase, TAccountEmail, TAccountLogin, TAccountResetPassword, TUpdateAccount } from "../../types/account.types.js";
import type { TVerficationToken } from "../../types/token.types.js";

dotenv.config();

// ACCOUNT LOGIN SERVICE
export async function loginAccountService({ user_email, user_password }: TAccountLogin) {
  try {
    if (!user_email || !user_password) throw new BadRequestError("All fields are required");

    if (!EMAIL_REGEX.test(user_email)) throw new BadRequestError("Invalid email address format");

    const user = await isUserExistingByEmailService({ user_email });

    const password_match = await bcrypt.compare(user_password, user.user_password);

    if (!password_match) throw new BadRequestError("Invalid Credentials");

    if (user.user_is_verified !== null) throw new BadRequestError("Please confirm your account and check your email");

    const sessionToken = await createAccountSessionService(user);

    return { user, sessionToken };
  } catch (error) {
    console.error("Something went wrong while logging account service:", error);
    throw new BadRequestError("Something went wrong while logging account service");
  }
}
// REGISTER ACCOUNT SERVICE
export async function registerAccountService(Account: TAccount) {
  try {
    const { user_name, user_email, user_password, confirm_password } = Account;

    if (!user_name || !user_email || !user_password) throw new BadRequestError("All fields are required");

    if (!EMAIL_REGEX.test(user_email)) throw new BadRequestError("Invalid email address");

    if (user_password.length < MIN_PASSWORD_LENGTH) throw new BadRequestError("Password must be at least 8 characters long");

    if (user_password !== confirm_password) throw new BadRequestError("Password mismatch");

    const hashPassword = await bcrypt.hash(user_password, SALT_ROUND);

    if (!process.env.APP_SECRET_KEY) throw new BadRequestError("APP SECRET KEY NOT FOUND: register account service");

    const isVerifiedToken = await sign(
      {
        sub: [user_email, new Date()],
      },
      process.env.APP_SECRET_KEY as string
    );

    const registerAccount = await registerAccountData({
      user_is_verified: isVerifiedToken,
      user_email,
      user_name,
      user_password: hashPassword,
    });

    if (!registerAccount) throw new BadRequestError("Failed to create account");

    const generatedJwe = await EncryptJWTToJWE(isVerifiedToken);

    const sendEmail = await createGmailSendingService(user_email, "CONFIRM_ACCOUNT", generatedJwe!);

    if (!sendEmail) throw new BadRequestError("Failed to send you a link, please try again");

    return registerAccount;
  } catch (error) {
    console.error("Something went wrong while registering account service:", error);
    throw new BadRequestError("Something went wrong while registering account service");
  }
}
// CREATE SESSION SERVICE (LOGIN)
async function createAccountSessionService(User: TAccount) {
  try {
    const { user_id, user_email, roles } = User;

    const sessionExpiresAt = new Date(Date.now() + 1000 * 60 * 60);

    if (!process.env.APP_SECRET_KEY) throw new BadRequestError("APP SECRET KEY NOT FOUND: create account session service");

    const sessionToken = await sign(
      {
        sub: [user_email, user_id],
        role: roles,
        exp: Math.floor(sessionExpiresAt.getTime() / 1000),
      },
      process.env.APP_SECRET_KEY as string
    );

    const createSession = await createSessionData({
      user_id,
      session_token: sessionToken,
      session_expires_at: sessionExpiresAt,
    });

    if (!createSession) throw new Error("Failed to create a session, please try again");

    return sessionToken;
  } catch (error) {
    console.error("Something went wrong while creating account session service:", error);
    throw new BadRequestError("Something went wrong while creating account session service");
  }
}
// SIGNING OUT ACCOUNT SERVICE
export async function signOutAccountService({ user_id }: TAccountBase) {
  try {
    if (!user_id) throw new BadRequestError("Failed to get user");

    const deleteSession = await deleteSessionData({ user_id });

    if (!deleteSession) throw new BadRequestError("Failed to delete session");

    return deleteSession;
  } catch (error) {
    console.error("Something went wrong while signing out account session service:", error);
    throw new BadRequestError("Something went wrong while signing out account session service");
  }
}
// GET ACCOUNT SERVICE
export async function getAccountService({ user_id }: TAccountBase) {
  try {
    const user = getUserData(user_id);

    if (!user) throw new BadRequestError("Account not found");

    const accessToken = await getSessionData({ user_id });

    if (!accessToken) throw new UnauthorizedError("Unauthorized token");

    return { user, accessToken };
  } catch (error) {
    console.error("Something went wrong while getting your account service:", error);
    throw new BadRequestError("Something went wrong while getting your account service");
  }
}
// GET VERIFICATION EMAIL TOKEN SERVICE (VERIFY TOKEN IN EMAIL LINK)
export async function getVerificationEmailTokenService({ reset_token }: TVerficationToken) {
  try {
    if (!reset_token) throw new BadRequestError("Token is required");

    const { user_email, date } = await DecryptJWEToJWT(reset_token);

    if (!process.env.APP_SECRET_KEY) throw new BadRequestError("APP SECRET KEY NOT FOUND: verfication account service");

    const confirmHashToken = await sign({ sub: [user_email, new Date(date)] }, process.env.APP_SECRET_KEY as string);

    const getUserIsVerified = await getAccountByVerificationHashData(confirmHashToken);

    if (!getUserIsVerified) throw new BadRequestError("Token not found");

    const deleteUserToken = await clearAccountVerificationStatusData({ user_id: getUserIsVerified.user_id });

    if (!deleteUserToken) throw new BadRequestError("Failed to verified account");

    return getUserIsVerified;
  } catch (error) {
    console.error("Something went wrong while verifying your account service:", error);
    throw new BadRequestError("Something went wrong while verifying your account service");
  }
}
// CREATE FORGOT PASSWORD SERVICE
export async function createResetPasswordService({ user_email }: TAccountEmail) {
  try {
    if (!user_email) throw new BadRequestError("Email is required");

    if (!EMAIL_REGEX.test(user_email)) throw new BadRequestError("Email is invalid");

    if (!process.env.APP_SECRET_KEY) throw new BadRequestError("APP SECRET KEY NOT FOUND: create forgot password account service");

    const user = await getUserByEmailData(user_email);

    if (!user) throw new BadRequestError("Email not existing");

    const resetUserToken = await getResetTokenByUserIdData({ user_id: user.user_id });

    if (resetUserToken) {
      const expires = new Date(resetUserToken.reset_token_expires_at.toString());

      const now = new Date(Date.now());

      if (now < expires) {
        throw new BadRequestError("We already sent you a reset link, please check your email");
      }

      const deleteToken = await deleteResetTokenData({ reset_token_id: resetUserToken.reset_token_id });

      if (!deleteToken) throw new BadRequestError("Failed to delete token");
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    const resetTokenHash = await sign(
      {
        sub: [user.user_email, new Date()],
        exp: Math.floor(expiresAt.getTime() / 1000),
      },
      process.env.APP_SECRET_KEY as string
    );

    const resetToken = await createResetPasswordTokenData({
      user_id: user.user_id,
      reset_token_hash: resetTokenHash,
      reset_token_expires_at: expiresAt,
    });

    if (!resetToken) throw new BadRequestError("Failed to create reset token");

    const jwe = await EncryptJWTToJWE(resetTokenHash);

    const sendEmail = await createGmailSendingService(user.user_email, "FORGOT_PASSWORD", jwe);

    if (!sendEmail) throw new BadRequestError("Failed to send you a link, please try again");

    return sendEmail;
  } catch (error) {
    console.error("Something went wrong while create forget password reset service:", error);
    throw new BadRequestError("Something went wrong while create forget password reset service");
  }
}
// RESET PASSWORD SERVICE
export async function resetPasswordService({ new_password, confirm_password, reset_token }: TAccountResetPassword) {
  try {
    if (!new_password || !confirm_password) throw new BadRequestError("Password & Confirm Password is required");

    if (!reset_token) throw new UnauthorizedError("Unauthorized Reset Token");

    const verifyToken = await getVerificationTokenService({ reset_token });

    if (!verifyToken) throw new BadRequestError("Token not verified");

    const resetToken = await getResetTokenData({ reset_token_hash: verifyToken });

    if (!resetToken) throw new BadRequestError("Token not found");

    const expiresAt = new Date(resetToken.reset_token_expires_at.toString());
    const now = new Date(Date.now());

    if (now > expiresAt) {
      await deleteResetTokenData({ reset_token_id: resetToken.reset_token_id });

      throw new BadRequestError("Link expired, please request another link");
    }

    if (new_password.length < MIN_PASSWORD_LENGTH || confirm_password.length < MIN_PASSWORD_LENGTH)
      throw new BadRequestError("Password must be at least 8 characters long");

    if (new_password !== confirm_password) throw new BadRequestError("Password mismatch");

    const hashPassword = await bcrypt.hash(new_password, SALT_ROUND);

    const resetPassword = await resetAccountPasswordData({
      new_password: hashPassword,
      user_id: resetToken.user_id,
    });

    if (!resetPassword) throw new BadRequestError("Failed to reset your password");

    await deleteResetTokenData({ reset_token_id: resetToken.reset_token_id });

    return resetPassword;
  } catch (error) {
    console.error("Something went wrong while reseting password service:", error);
    throw new BadRequestError("Something went wrong while reseting password service");
  }
}
// GET VERIFICATION TOKEN SERVICE
export async function getVerificationTokenService({ reset_token }: TVerficationToken) {
  try {
    if (!reset_token) throw new BadRequestError("No token provided");

    if (!process.env.APP_SECRET_KEY) throw new BadRequestError("APP SECRET KEY NOT FOUND: register account service");

    const { user_email, date, tokenExpiry } = await DecryptJWEToJWT(reset_token);

    const isTokenExpired = tokenExpiry < Math.floor(Date.now() / 1000);

    if (isTokenExpired) throw new BadRequestError("The token has expired.");

    const resetTokenHash = await sign(
      {
        sub: [user_email, new Date(date)],
        exp: tokenExpiry,
      },
      process.env.APP_SECRET_KEY as string
    );

    const getResetToken = await getResetTokenData({ reset_token_hash: resetTokenHash });

    if (!getResetToken) throw new BadRequestError("Token not found");

    if (getResetToken.reset_token_expires_at < new Date()) {
      const deleteToken = await deleteResetTokenData({ reset_token_id: getResetToken.reset_token_id });

      if (!deleteToken) throw new BadRequestError("Failed to delete token");

      throw new BadRequestError("The reset token has expired.");
    }

    return resetTokenHash;
  } catch (error) {
    console.error("Something went wrong while getting verification token service:", error);
    throw new BadRequestError("Something went wrong while getting verification token service");
  }
}
// RESET PROFILE PASSWORD SERVICE
export async function resetAccountPasswordService({
  user_id,
  user_password,
  new_password,
  confirm_password,
}: {
  user_id: string;
  user_password: string;
  new_password: string;
  confirm_password: string;
}) {
  try {
    if (!user_password || !new_password || !confirm_password) throw new BadRequestError("All fields are required");

    const user = await isUserExistingService({ user_id });

    const isPasswordMatch = await bcrypt.compare(user_password, user.user_password);

    if (!isPasswordMatch) throw new BadRequestError("Password mismatch");

    if (new_password !== confirm_password) throw new BadRequestError("Password mismatch");

    const newHashPassword = await bcrypt.hash(new_password, SALT_ROUND);

    const updateAccountPassword = await updateAccountPasswordData({
      user_id: user.user_id,
      user_password: newHashPassword,
    });

    if (!updateAccountPassword) throw new BadRequestError("Failed to change your password, please try again");

    return updateAccountPassword;
  } catch (error) {
    console.error("Something went wrong while resetting account password service:", error);
    throw new BadRequestError("Something went wrong while resetting account password service");
  }
}
// UPDATE ACCOUNT SERVICE
export async function updateAccountService({ user_id, account }: { user_id: string; account: any }) {
  try {
    let { user_profile } = account;
    const { user_name, user_phone } = account;

    if (!user_id) throw new BadRequestError("User ID not found");

    await isUserExistingService({ user_id });

    if (!user_name) throw new BadRequestError("User name is required");

    if (user_phone && !PH_PHONE_REGEX.test(user_phone)) throw new BadRequestError("Invalid phone number format");

    if (user_profile && user_profile instanceof File) {
      await validateFileService({ image: user_profile });

      const uploadFile = await createFileService({
        image: user_profile,
        folder_name: "profile",
      });

      if (!uploadFile) {
        throw new BadRequestError("Cannot upload file, please try again");
      }

      user_profile = uploadFile.url;
    }
    const data: any = {
      user_name: user_name,
      user_phone: null,
    };

    if (user_phone !== undefined) {
      data.user_phone = user_phone;
    }

    if (user_profile !== undefined) {
      data.user_profile = user_profile ?? null;
    }

    const updateAccount = await updateAccountData({ account: data, user_id });

    if (!updateAccount) throw new BadRequestError("Failed to update your profile");

    return updateAccount;
  } catch (error) {
    console.error("Something went wrong while updating profile service:", error);
    throw new BadRequestError("Something went wrong while updating profile service");
  }
}
// DELETE IMAGE ACCOUNT SERVICE
export async function deleteImageAccountService({ user_id }: TAccountBase) {
  try {
    if (!user_id) throw new BadRequestError("User ID not found");

    const user = await isUserExistingService({ user_id });

    const deleteUserImage = await deleteAccountImageData({ user_id });

    if (!deleteUserImage) throw new BadRequestError("Failed to remove your image");

    const deleteImage = await DeleteCloudinaryImage({ image: user.user_profile!, folder_name: "profile" });

    return deleteImage;
  } catch (error) {
    console.error("Something went wrong while deleting image profile service");
    throw new BadRequestError("Something went wrong while deleting image profile service");
  }
}
