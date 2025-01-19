import type { Next } from "hono";
import type { Context } from "hono";
import { UnauthorizedError } from "../utils/error.js";
import { verify } from "hono/jwt";
import dotenv from "dotenv";

dotenv.config();

export async function authenticationMiddlewares(c: Context, next: Next) {
  const accessToken = await c.req.header("Authorization")?.split("Bearer ")[1];

  if (!accessToken) {
    throw new UnauthorizedError("Authentication token is required");
  }
  try {
    const verifyToken = await verify(
      accessToken,
      process.env.APP_SECRET_KEY as string
    );

    if (!verifyToken) {
      throw new UnauthorizedError("Invalid authentication token");
    }

    return await next();
    
  } catch (error) {
    throw new UnauthorizedError("Invalid authentication token");
  }
}
