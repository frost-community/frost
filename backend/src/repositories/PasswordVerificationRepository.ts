import { password_verification } from "@prisma/client";
import { Container } from "inversify";
import { TYPES } from "../container/types";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";

/*
 * パスワード検証情報を追加する
*/
export async function create(
  params: { userId: string, algorithm: string, salt: string, iteration: number, hash: string },
  ctx: AccessContext,
  container: Container,
): Promise<password_verification> {
  const db = container.get<DB>(TYPES.db);
  const row = await db.password_verification.create({
    data: {
      user_id: params.userId,
      algorithm: params.algorithm,
      salt: params.salt,
      iteration: params.iteration,
      hash: params.hash,
    },
  });

  return row;
}

/*
 * パスワード検証情報を取得する
*/
export async function get(
  params: { userId: string },
  ctx: AccessContext,
  container: Container,
): Promise<password_verification | undefined> {
  const db = container.get<DB>(TYPES.db);
  const row = await db.password_verification.findFirst({
    where: {
      user_id: params.userId,
    },
  });

  if (row == null) {
    return undefined;
  }

  return row;
}

/**
 * パスワード検証情報を削除する
 * @returns 削除に成功したかどうか
*/
export async function remove(
  params: { userId: string },
  ctx: AccessContext,
  container: Container,
): Promise<boolean> {
  const db = container.get<DB>(TYPES.db);
  const result = await db.password_verification.deleteMany({
    where: {
      user_id: params.userId,
    },
  });

  return (result.count > 0);
}
