import { user } from "@prisma/client";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";
import { UserEntity } from "../modules/entities";
import { Container } from "inversify";
import { TYPES } from "../container/types";

/**
 * ユーザーを追加する
*/
export async function create(
  params: { userName: string, displayName: string, passwordAuthEnabled: boolean },
  ctx: AccessContext,
  container: Container,
) {
  const db = container.get<DB>(TYPES.db);

  const row = await db.user.create({
    data: {
      name: params.userName,
      display_name: params.displayName,
      password_auth_enabled: params.passwordAuthEnabled,
    },
  });

  return mapEntity(row);
}

/**
 * ユーザーを取得する
*/
export async function get(
  params: { userId?: string, userName?: string },
  ctx: AccessContext,
  container: Container,
): Promise<UserEntity | undefined> {
  const db = container.get<DB>(TYPES.db);

  if ([params.userId, params.userName].every(x => x == null)) {
    throw new Error("invalid condition");
  }

  const row = await db.user.findFirst({
    where: {
      user_id: params.userId,
      name: params.userName,
    }
  });

  if (row == null) {
    return undefined;
  }

  return mapEntity(row);
}

/**
 * ユーザーを削除する
 * @returns 削除に成功したかどうか
*/
export async function remove(
  params: { userId: string },
  ctx: AccessContext,
  container: Container,
): Promise<boolean> {
  const db = container.get<DB>(TYPES.db);

  const result = await db.user.deleteMany({
    where: {
      user_id: params.userId,
    },
  });

  return (result.count > 0);
}

function mapEntity(row: user): UserEntity {
  return {
    userId: row.user_id,
    userName: row.name,
    displayName: row.display_name,
    passwordAuthEnabled: row.password_auth_enabled,
  };
}
