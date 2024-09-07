import { user } from "@prisma/client";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";
import { UserEntity } from "../modules/entities";

/**
 * ユーザーを追加する
*/
export async function createUser(
  params: { name: string, displayName: string, passwordAuthEnabled: boolean },
  ctx: AccessContext,
  db: DB,
) {
  const row = await db.user.create({
    data: {
      name: params.name,
      display_name: params.displayName,
      password_auth_enabled: params.passwordAuthEnabled,
    },
  });

  return mapEntity(row);
}

/**
 * ユーザーを取得する
*/
export async function getUser(
  params: { userId?: string, name?: string },
  ctx: AccessContext,
  db: DB,
): Promise<UserEntity | undefined> {
  if ([params.userId, params.name].every(x => x == null)) {
    throw new Error("invalid condition");
  }

  const row = await db.user.findFirst({
    where: {
      user_id: params.userId,
      name: params.name,
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
export async function deleteUser(
  params: { userId: string },
  ctx: AccessContext,
  db: DB,
): Promise<boolean> {
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
    name: row.name,
    displayName: row.display_name,
    passwordAuthEnabled: row.password_auth_enabled,
  };
}
