import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createSessionData({
  user_id,
  session_token,
  session_expires_at,
}: {
  user_id: string;
  session_token: string;
  session_expires_at: Date;
}) {
  const session = await prisma.tbl_session.create({
    data: {
      user_id,
      session_token,
      session_expires_at,
    },
  });

  return session;
}

export async function getSessionData({ user_id }: { user_id: string }) {
  const session = await prisma.tbl_session.findFirst({
    where: {
      user_id,
    },
  });
  return session;
}

export async function updateSessionData({
  session_id,
  session_token,
  extended_expires_at,
}: {
  session_id: string;
  session_token: string;
  extended_expires_at: Date;
}) {
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
}

export async function deleteSessionData({ user_id }: { user_id: string }) {
  const session = await prisma.tbl_session.deleteMany({
    where: {
      user_id,
    },
  });

  return session;
}
