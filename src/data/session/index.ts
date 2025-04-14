import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../../utils/error.js";
import type { TAccountBase } from "../../types/account.types.js";
import type { TSessionCreate, TSessionUpdate } from "../../types/session.types.js";

const prisma = new PrismaClient();

// CREATE SESSION DATA
export async function createSessionData({ user_id, session_token, session_expires_at }: TSessionCreate) {
  try {
    const session = await prisma.tbl_session.create({
      data: {
        user_id,
        session_token,
        session_expires_at,
      },
    });
    return session;
  } catch (error) {
    console.error("Error to create session:", error);
    throw new BadRequestError("Unable to create session");
  }
}
// GET THE SESSION DATA
export async function getSessionData({ user_id }: TAccountBase) {
  try {
    const session = await prisma.tbl_session.findFirst({ where: { user_id } });
    return session;
  } catch (error) {
    console.error("Error to get session:", error);
    throw new BadRequestError("Unable to get session");
  }
}
// UPDATE THE SESSION DATA (EXTEND THE EXPIRES AT IF THE USER NOT IDLE)
export async function updateSessionData({ session_id, session_token, extended_expires_at }: TSessionUpdate) {
  try {
    const session = await prisma.tbl_session.update({
      data: {
        session_expires_at: extended_expires_at,
        session_token,
      },
      where: {
        session_id,
      },
    });
    return session;
  } catch (error) {
    console.error("Error to update session:", error);
    throw new BadRequestError("Unable to update session");
  }
}
// DELETE SESSION DATA
export async function deleteSessionData({ user_id }: TAccountBase) {
  try {
    const session = await prisma.tbl_session.deleteMany({ where: { user_id } });
    return session;
  } catch (error) {
    console.error("Something went wrong while deleting session data:", error);
    throw new BadRequestError("Something went wrong while deleting session data");
  }
}
