import * as sql from "@prisma/client/sql";
import { injectable } from "inversify";
import { AccessContext } from "../modules/AccessContext";
import { TokenEntity } from "../modules/entities";

export type TokenKind = "access_token" | "refresh_token";

@injectable()
export class TokenRepository {
  public async create(params: { userId: string, tokenKind: TokenKind, scopes: string[], token: string, }, ctx: AccessContext): Promise<TokenEntity> {
    // トークンを登録
    const token = await ctx.db.token.create({
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
      await ctx.db.token_scope.createMany({
        data: tokenScopes,
      });
    }

    return {
      token: params.token,
      scopes: [...params.scopes],
    };
  }

  public async get(params: { token: string }, ctx: AccessContext): Promise<{ tokenKind: TokenKind, userId: string, scopes: string[] } | undefined> {
    // トークン情報を取得
    const rows = await ctx.db.$queryRawTyped(sql.getTokenInfo(params.token));
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
   * @returns 削除に成功したかどうか
  */
  public async delete(params: { token: string }, ctx: AccessContext): Promise<boolean> {
    const tokenRecord = await ctx.db.token.findFirst({
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
    const result = await ctx.db.token.deleteMany({
      where: {
        token_id: tokenRecord.token_id,
      },
    });
    if (result.count == 0) {
      return false;
    }

    // トークンの権限を削除 (0件以上)
    await ctx.db.token_scope.deleteMany({
      where: {
        token_id: tokenRecord.token_id,
      },
    });

    return true;
  }
}
