import { PrismaClient } from "@prisma/client";
import { PrismaTransaction } from "./httpRoute/ApiRouteBuilder";

export type AccessContext = {
  userId: string,
  db: PrismaClient | PrismaTransaction,
};
