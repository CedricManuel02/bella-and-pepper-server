import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function getUserData(user_id: string){

    const user = await prisma.tbl_users.findFirst({where: {user_id: user_id}});

    return user;
}