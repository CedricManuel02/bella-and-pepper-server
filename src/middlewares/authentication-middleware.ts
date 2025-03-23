import type { Next } from "hono";
import type { Context } from "hono";
import { BadRequestError, UnauthorizedError } from "../utils/error.js";
import { decode, sign, verify } from "hono/jwt";
import dotenv from "dotenv";
import { getCookie, setCookie } from "hono/cookie";
import { getSessionData, updateSessionData } from "../data/session/index.js";

dotenv.config();

interface JwtPayload {
  sub: string[];
  role: string;
}

export async function authenticationMiddlewares(c: Context, next: Next) {
  const session_token = getCookie(c, "auth__token");

  if (!session_token) throw new UnauthorizedError("Unauthorized: No session token");

  const _verify = await verify(session_token, process.env.APP_SECRET_KEY as string);

  if (!_verify) throw new UnauthorizedError("Unauthorized token");

  const { payload } = decode(session_token) as unknown as { payload: JwtPayload };

  if (!payload || (payload.role !== "ADMIN" && payload.role !== "USER")) {
    throw new UnauthorizedError("Access denied: Insufficient privileges");
  }

  const session = await getSessionData({ user_id: payload.sub[1] });

  if (!session) throw new BadRequestError("Session not found");

  const expires_at = new Date(session.session_expires_at);

  if (expires_at < new Date()) throw new BadRequestError("Session expired");

  const extended_expires_at = new Date(Date.now() + 1000 * 60 * 60);

  const new_session_token = await sign(
    {
      sub: [payload.sub[0], payload.sub[1]],
      role: payload.role,
      exp: Math.floor(extended_expires_at.getTime() / 1000),
    },
    process.env.APP_SECRET_KEY as string
  );

  const updated_session = await updateSessionData({ session_id: session.session_id, session_token: new_session_token, extended_expires_at });

  if (!updated_session) throw new BadRequestError("Failed to extend expires at");

  setCookie(c, "auth__token", new_session_token, {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "Strict",
    expires: expires_at,
  });

  c.set("user_id", session.user_id);

  return await next();
}
