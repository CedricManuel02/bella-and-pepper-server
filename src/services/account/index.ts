import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { BadRequestError, UnauthorizedError } from "../../utils/error.js";
import type { IAccount, IUsers } from "../../interfaces/interface.js";
import { EMAIL_REGEX, MIN_PASSWORD_LENGTH, PH_PHONE_REGEX, PRIVATE_KEY_PEM, PUBLIC_KEY_PEM, SALT_ROUND } from "../../constant/constant.js";
import {
  createResetTokenData,
  deleteImageProfileData,
  deleteResetTokenData,
  deleteUserTokenData,
  getResetTokenByUserIdData,
  getResetTokenData,
  getUserByEmailData,
  getUserByTokenData,
  registerAccountData,
  resetPasswordAccountData,
  updateAccountPasswordData,
  updateProfileData,
} from "../../data/account/index.js";
import { createSessionData, deleteSessionData, getSessionData } from "../../data/session/index.js";
import { getUserData } from "../../data/user/index.js";
import { createGmailSendingService } from "../../utils/send-email.js";

import * as jose from "jose";
import { createFileService, deleteFileService, formatFileService, validateFileService } from "../file/index.js";
import { isUserExistingByEmailService } from "../user/index.js";
dotenv.config();

// SERVICE ACCOUNT LOGIN
export async function loginAccountService({ user_email, user_password }: { user_email: string; user_password: string }) {
  if (!user_email || !user_password) throw new BadRequestError("All fields are required");

  if (!EMAIL_REGEX.test(user_email)) throw new BadRequestError("Invalid email address format");

  const user = await isUserExistingByEmailService(user_email);

  const password_match = await bcrypt.compare(user_password, user.user_password);

  if (!password_match) throw new BadRequestError("Invalid Credentials");

  if (user.user_is_verified !== null) throw new BadRequestError("Please confirm your account, check your email");

  const session_token = await createAccountSessionService(user);

  return { user, session_token };
}

// CREATE SESSION SERVICE (LOGIN)
async function createAccountSessionService(user: IUsers) {
  try {
    const { user_id, user_email, roles } = user;
    const session_expires_at = new Date(Date.now() + 1000 * 60 * 60);

    const session_token = await sign(
      {
        sub: [user_email, user_id],
        role: roles,
        exp: Math.floor(session_expires_at.getTime() / 1000),
      },
      process.env.APP_SECRET_KEY as string
    );

    const create_session = await createSessionData({
      user_id,
      session_token,
      session_expires_at,
    });

    if (!create_session) throw new Error("Failed to create a session, please try again");

    return session_token;
  } catch (error) {
    console.error("Something went wrong while creating account session service:", error);
    throw new BadRequestError("Something went wrong while creating account session service");
  }
}

// SERVICE SIGNING OUT ACCOUNT
export async function signOutAccountService(user_id: string) {
  try {
    if (!user_id) throw new BadRequestError("Failed to get user");

    const signout = await deleteSessionData(user_id);

    return signout;
  } catch (error) {
    console.error("Something went wrong while signing out account session service:", error);
    throw new BadRequestError("Something went wrong while signing out account session service");
  }
}

export async function registerAccountService(payload: IAccount) {
  const { user_name, user_email, user_password, confirm_password } = payload;

  if (!user_name || !user_email || !user_password) throw new BadRequestError("All fields are required");

  if (!EMAIL_REGEX.test(user_email)) throw new BadRequestError("Invalid email address");

  if (user_password.length < MIN_PASSWORD_LENGTH) throw new BadRequestError("Password must be at least 8 characters long");

  if (user_password !== confirm_password) throw new BadRequestError("Password mismatch");

  const hash_password = await bcrypt.hash(user_password, SALT_ROUND);

  const user_is_verified = await sign(
    {
      sub: [user_email, new Date()],
    },
    process.env.APP_SECRET_KEY as string
  );

  const registerData = await registerAccountData({ user_is_verified, user_email, user_name, user_password: hash_password });

  if (!registerData) throw new BadRequestError("Failed to create account");

  const publicKey = await jose.importSPKI(PUBLIC_KEY_PEM, "RSA-OAEP-256");

  const jwe = await new jose.CompactEncrypt(new TextEncoder().encode(user_is_verified))
    .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
    .encrypt(publicKey);

  const sendEmail = await createGmailSendingService(user_email, "CONFIRM_ACCOUNT", jwe);

  if (!sendEmail) throw new BadRequestError("Failed to send you a link, please try again");

  return registerData;
}

export async function getVerificationEmailTokenServer(token: string) {
  if (!token) throw new BadRequestError("No token provided");

  const privateKey = await jose.importPKCS8(PRIVATE_KEY_PEM, "RSA-OAEP-256");

  const { plaintext } = await jose.compactDecrypt(token, privateKey);

  const decodedPayload = new TextDecoder().decode(plaintext);

  const payloadBase64Url = decodedPayload.split(".")[1];
  const padding = "=".repeat((4 - (payloadBase64Url.length % 4)) % 4);
  const payloadBase64 = payloadBase64Url + padding;
  const payloadJson = JSON.parse(atob(payloadBase64));

  const confirm_token_hash = await sign(
    {
      sub: [payloadJson.sub[0], new Date(payloadJson.sub[1])],
    },
    process.env.APP_SECRET_KEY as string
  );

  const getUserIsVerified = await getUserByTokenData(confirm_token_hash);

  if (!getUserIsVerified) throw new BadRequestError("Token not found");

  const userIsVerified = await deleteUserTokenData(getUserIsVerified.user_id);

  if (!userIsVerified) throw new BadRequestError("Failed to verified account");

  return getUserIsVerified;
}

export async function getAccountService(user_id: string) {
  const user = getUserData(user_id);

  if (!user) throw new BadRequestError("Account not found");

  const access_token = await getSessionData({ user_id });

  if (!access_token) throw new UnauthorizedError("Unauthorized token");

  return { user, access_token };
}

export async function createForgotPasswordService({ user_email }: { user_email: string }) {
  if (!user_email) throw new BadRequestError("Email is required");

  if (!EMAIL_REGEX.test(user_email)) throw new BadRequestError("Email is invalid");

  const user = await getUserByEmailData(user_email);

  if (!user) throw new BadRequestError("No account found with that email address");

  const existingReset = await getResetTokenByUserIdData(user.user_id);

  if (existingReset) {
    const expires = new Date(existingReset.reset_token_expires_at.toString());
    const now = new Date(Date.now());
    if (now < expires) {
      throw new BadRequestError("We already sent you a reset link, please check your email");
    }
    const deleteToken = await deleteResetTokenData(existingReset.reset_token_id);
    if (!deleteToken) throw new BadRequestError("Failed to delete token");
  }

  const expires_at = new Date(Date.now() + 1000 * 60 * 60);

  const reset_token_hash = await sign(
    {
      sub: [user.user_email, new Date()],
      exp: Math.floor(expires_at.getTime() / 1000),
    },
    process.env.APP_SECRET_KEY as string
  );

  const resetToken = await createResetTokenData({ reset_token_hash, user_id: user.user_id, reset_token_expires_at: expires_at });

  if (!resetToken) throw new BadRequestError("Failed to create reset token");

  const publicKey = await jose.importSPKI(PUBLIC_KEY_PEM, "RSA-OAEP-256");

  const jwe = await new jose.CompactEncrypt(new TextEncoder().encode(reset_token_hash))
    .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
    .encrypt(publicKey);

  const sendEmail = await createGmailSendingService(user.user_email, "FORGOT_PASSWORD", jwe);

  if (!sendEmail) throw new BadRequestError("Failed to send you a link, please try again");

  return sendEmail;
}

export async function resetPasswordService({
  new_password,
  confirm_password,
  reset_token,
}: {
  new_password: string;
  confirm_password: string;
  reset_token: string;
}) {
  if (!new_password || !confirm_password) throw new BadRequestError("Password is required");

  if (!reset_token) throw new UnauthorizedError("Unauthorized");

  const verifyToken = await getVerificationTokenService(reset_token);

  if (!verifyToken) throw new BadRequestError("Token not verified");

  const resetToken = await getResetTokenData(verifyToken.reset_token_hash);

  if (!resetToken) throw new BadRequestError("Token not found");

  const expires_at = new Date(resetToken.reset_token_expires_at.toString());
  const now = new Date(Date.now());

  if (now > expires_at) {
    await deleteResetTokenData(resetToken.reset_token_id);
    throw new BadRequestError("Link expired, please request another link");
  }

  if (new_password.length < MIN_PASSWORD_LENGTH || confirm_password.length < MIN_PASSWORD_LENGTH)
    throw new BadRequestError("Password must be at least 8 characters long");

  if (new_password !== confirm_password) throw new BadRequestError("Password mismatch");

  const hash_password = await bcrypt.hash(new_password, SALT_ROUND);

  const updateAccount = await resetPasswordAccountData({ new_password: hash_password, user_id: resetToken.user_id });

  if (!updateAccount) throw new BadRequestError("Failed to reset password");

  await deleteResetTokenData(resetToken.reset_token_id);

  return updateAccount;
}

export async function getVerificationTokenService(token: string) {
  if (!token) throw new BadRequestError("No token provided");

  const privateKey = await jose.importPKCS8(PRIVATE_KEY_PEM, "RSA-OAEP-256");

  const { plaintext } = await jose.compactDecrypt(token, privateKey);

  const decodedPayload = new TextDecoder().decode(plaintext);

  const payloadBase64Url = decodedPayload.split(".")[1];
  const padding = "=".repeat((4 - (payloadBase64Url.length % 4)) % 4);
  const payloadBase64 = payloadBase64Url + padding;
  const payloadJson = JSON.parse(atob(payloadBase64));

  const now = Math.floor(Date.now() / 1000);
  if (payloadJson.exp < now) {
    throw new BadRequestError("The token has expired.");
  }

  const reset_token_hash = await sign(
    {
      sub: [payloadJson.sub[0], new Date(payloadJson.sub[1])],
      exp: payloadJson.exp,
    },
    process.env.APP_SECRET_KEY as string
  );

  const getResetToken = await getResetTokenData(reset_token_hash);

  if (!getResetToken) throw new BadRequestError("Token not found");

  if (getResetToken?.reset_token_expires_at < new Date()) {
    const deleteToken = await deleteResetTokenData(getResetToken.reset_token_id);
    if (!deleteToken) throw new BadRequestError("Failed to delete token");
    throw new BadRequestError("The reset token has expired.");
  }

  return { reset_token_hash };
}

export async function resetProfilePasswordService({
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
  if (!user_password || !new_password || !confirm_password) throw new BadRequestError("All fields are required");

  const user = await getUserData(user_id);

  if (!user) throw new BadRequestError("User not found");

  const password_match = await bcrypt.compare(user_password, user.user_password);

  if (!password_match) throw new BadRequestError("Password mismatch");

  if (new_password !== confirm_password) throw new BadRequestError("Password mismatch");

  const new_hash_password = await bcrypt.hash(new_password, SALT_ROUND);

  const updatePasswordAccount = await updateAccountPasswordData({ user_id: user.user_id, user_password: new_hash_password });

  if (!updatePasswordAccount) throw new BadRequestError("Failed to change password, please try again");

  return updatePasswordAccount;
}

export async function updateProfileService({ user_id, account }: { user_id: string; account: any }) {
  if (!user_id) throw new BadRequestError("User ID not found");

  const user = await getUserData(user_id);

  if (!user) throw new BadRequestError("User not found");

  if (!account.user_name) throw new BadRequestError("User name is required");

  if (account.user_phone && !PH_PHONE_REGEX.test(account.user_phone)) {
    throw new BadRequestError("Invalid phone number format");
  }

  if (account.user_profile && account.user_profile instanceof File) {
    await validateFileService({ image: account.user_profile });

    const uploadFile = await createFileService({
      image: account.user_profile,
      folder_name: "profile",
    });

    if (!uploadFile) {
      throw new BadRequestError("Cannot upload file, please try again");
    }

    account.user_profile = uploadFile.url;
  }
  const data: any = {
    user_name: account.user_name,
    user_phone: null,
  };

  if (account.user_phone !== undefined) {
    data.user_phone = account.user_phone;
  }

  if (account.user_profile !== undefined) {
    data.user_profile = account.user_profile ?? null;
  }

  const updateProfile = await updateProfileData({ account: data, user_id });

  if (!updateProfile) throw new BadRequestError("Failed to update profile");

  return updateProfile;
}

export async function deleteImageProfileService({ user_id }: { user_id: string }) {
  if (!user_id) throw new BadRequestError("User ID not found");

  const user = await getUserData(user_id);

  if (!user) throw new BadRequestError("User not found");

  const removeImage = await deleteImageProfileData({ user_id });

  if (!removeImage) throw new BadRequestError("Failed to remove your image");

  const fileName = await formatFileService({ image: user.user_profile! });

  const deleteFile = await deleteFileService({ filename: fileName, folder_name: "profile" });

  if (!deleteFile) throw new BadRequestError("Failed to delete image from cloudinary, please try again");

  return deleteFile;
}
