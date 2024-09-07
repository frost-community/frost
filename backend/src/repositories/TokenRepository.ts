import * as sql from "@prisma/client/sql";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";
import { TokenEntity } from "../modules/entities";

export type TokenKind = "access_token" | "refresh_token";

/**
 * トークン情報を追加する
*/
export async function createTokenInfo(
  params: { userId: string, tokenKind: TokenKind, scopes: string[], token: string, },
  ctx: AccessContext,
  db: DB,
): Promise<TokenEntity> {
  // トークンを登録
  const token = await db.token.create({
    data: {
      token_kind: params.tokenKind,
      user_id: params.userId,
      token: params.token,
    },
    select: {
      token_id: true,
    },
  });

  // トークンの権限を登録
  if (params.scopes.length > 0) {
    const tokenScopes: { token_id: string, scope_name: string }[] = params.scopes.map(scope => {
      return {
        token_id: token.token_id,
        scope_name: scope,
      };
    });
    await db.token_scope.createMany({
      data: tokenScopes,
    });
  }

  return {
    token: params.token,
    scopes: [...params.scopes],
  };
}

/**
 * トークン情報を取得する
*/
export async function getTokenInfo(
  params: { token: string },
  ctx: AccessContext,
  db: DB,
): Promise<{ tokenKind: TokenKind, userId: string, scopes: string[] } | undefined> {
  // トークン情報を取得
  const rows = await db.$queryRawTyped(sql.getTokenInfo(params.token));
  if (rows.length == 0) {
    return undefined;
  }
  const row = rows[0]!;

  return {
    userId: row.user_id,
    tokenKind: row.token_kind as TokenKind,
    scopes: row.scopes ?? [],
  };
}

/**
 * トークン情報を削除する
 * @returns 削除に成功したかどうか
*/
export async function deleteTokenInfo(
  params: { token: string },
  ctx: AccessContext,
  db: DB,
): Promise<boolean> {
  const tokenRecord = await db.token.findFirst({
    where: {
      token: params.token,
    },
    select: {
      token_id: true,
    },
  });
  if (tokenRecord == null) {
    return false;
  }

  // トークンを削除
  const result = await db.token.deleteMany({
    where: {
      token_id: tokenRecord.token_id,
    },
  });
  if (result.count == 0) {
    return false;
  }

  // トークンの権限を削除 (0件以上)
  await db.token_scope.deleteMany({
    where: {
      token_id: tokenRecord.token_id,
    },
  });

  return true;
}
