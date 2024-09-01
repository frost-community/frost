import { PrismaClient } from "@prisma/client";

export type AccessContext = {
  userId: string,
  db: PrismaClient,
};
