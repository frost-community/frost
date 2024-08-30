import { token, token_scope } from "@prisma/client";
import { injectable } from "inversify";
import { AccessContext } from "../modules/AccessContext";

export type TokenKind = "access_token" | "refresh_token";

@injectable()
export class TokenRepository {
  public async create(params: { userId: string, tokenKind: TokenKind, scopes: string[], token: string, }, ctx: AccessContext): Promise<TokenEntity> {
    // トークンを登録
    const tokenRows = await ctx.db.getCurrent()
      .insert(tokenTable)
      .values({
          tokenKind: params.tokenKind,
          userId: params.userId,
          token: params.token,
      })
      .returning({ tokenId: tokenTable.tokenId });
    const token = tokenRows[0]!;

    // トークンの権限を登録
    if (params.scopes.length > 0) {
      const tokenScopes: CreateTokenScopeParameters[] = params.scopes.map(scope => {
        return {
          tokenId: token.tokenId,
          scopeName: scope,
        };
      });
      await ctx.db.getCurrent()
        .insert(tokenScopeTable)
        .values(tokenScopes);
    }

    return {
      token: params.token,
      scopes: [...params.scopes],
    };
  }

  public async get(params: { token: string }, ctx: AccessContext): Promise<{ tokenKind: TokenKind, userId: string, scopes: string[] } | undefined> {
    const rows = await ctx.db.getCurrent()
      .select({
        userId: tokenTable.userId,
        tokenKind: tokenTable.tokenKind,
        scopes:  sql<string[]>`array_agg(${tokenScopeTable.scopeName})`,
      })
      .from(tokenTable)
      .leftJoin(
        tokenScopeTable,
        eq(tokenScopeTable.tokenId, tokenTable.tokenId)
      )
      .where(eq(tokenTable.token, params.token))
      .groupBy(tokenTable.tokenId);
    if (rows.length == 0) {
      return undefined;
    }
    const row = rows[0]!;
    return {
      userId: row.userId,
      tokenKind: row.tokenKind as TokenKind,
      scopes: row.scopes,
    };
  }

  /**
   * @returns 削除に成功したかどうか
  */
  public async delete(params: { token: string }, ctx: AccessContext): Promise<boolean> {
    const tokenRows = await ctx.db.getCurrent()
      .select({
        tokenId: tokenTable.tokenId,
      })
      .from(tokenTable)
      .where(eq(tokenTable.token, params.token));
    if (tokenRows.length == 0) {
      return false;
    }
    const tokenRecord = tokenRows[0]!;

    // トークンを削除
    const deleteTokenResult = await ctx.db.getCurrent()
      .delete(tokenTable)
      .where(eq(tokenTable.tokenId, tokenRecord.tokenId));
    if (deleteTokenResult.rowCount == 0) {
      return false;
    }

    // トークンの権限を削除 (0件以上)
    await ctx.db.getCurrent()
      .delete(tokenScopeTable)
      .where(eq(tokenScopeTable.tokenId, tokenRecord.tokenId));

    return true;
  }
}
