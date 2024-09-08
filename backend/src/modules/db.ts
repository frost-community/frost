import { PrismaClient } from "@prisma/client";
import type * as prismaRuntime from "@prisma/client/runtime/library";

export type PrismaTransaction = Omit<PrismaClient, prismaRuntime.ITXClientDenyList>;

export type DB = PrismaClient | PrismaTransaction;
