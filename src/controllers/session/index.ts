import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { UnauthorizedError } from "../../utils/error.js";

export async function getSessionController(c: Context){
    const session_token = await getCookie(c, "auth__token");

    if(!session_token) throw new UnauthorizedError("Unauthorized and no session");

    return c.json({message: "Success"});
    
}