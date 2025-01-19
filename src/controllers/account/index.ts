import type { Context } from "hono";
import {loginAccountService, registerAccountService} from "../../services/account/index.js";
import { fileURLToPath } from "url";
import path from "path";
import * as fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.resolve(__dirname, "../../"); 
const uploadDir = path.join(srcPath, "uploads");
export async function loginAccountController(c: Context) {
  const body = await c.req.json();

  const loginService = await loginAccountService(body);

  return c.json({ payload: loginService, payloadType: "login" });
}

export async function registerAccountController(c: Context) {
  const body = await c.req.json();

  const registerService = await registerAccountService(body);

  return c.json({ payload: registerService, payloadType: "register" });
}
export async function getUser(c: Context){
  const body = await c.req.parseBody();
  const file = body["file"];

  if (file instanceof File) {
      const buffer = await file.arrayBuffer();

      try {
       fs.writeFileSync(`${uploadDir}/Image1.jpg`, Buffer.from(buffer));
       return c.text("Success loading image")
      } catch (error) {
       console.log(error);
      }
  } else {
      return c.json({error: "Invalid file type", payloadType: "getUser"});
  }
}