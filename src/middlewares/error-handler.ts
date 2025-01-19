import { type Context } from "hono";
import { makeError } from "../utils/error.js";

export async function errorHandlerMiddleware(err: Error, c: Context) {
  const { error, statusCode } = makeError(err);
  console.error(error.message, error);
  return c.json(error, { status: statusCode } as any);
}