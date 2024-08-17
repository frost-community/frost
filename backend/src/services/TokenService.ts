import crypto from "node:crypto";
import { Container, inject, injectable } from "inversify";
import { TYPES } from "../container/types";
import { ConnectionLayers } from "../modules/database";
import { InferInsertTokenScope, tokenTable, tokenScopeTable } from "../database/schema";
import { TokenEntity } from "../types/entities";
import { eq } from "drizzle-orm";
import { appError, Unauthenticated } from "../modules/apiErrors";
import { AccessContext } from "../types/access-context";

@injectable()
export class TokenService {
  constructor(
  ) {}

  private generateTokenValue(length: number) {
    let token = "";
    for (const [_index, byte] of crypto.randomBytes(length).entries()) {
      token += TokenService.asciiTable[byte % TokenService.asciiTable.length];
    }
    return token;
  }

  async getTokenInfo(params: { token: string }, ctx: AccessContext): Promise<{ tokenKind: string, userId: string, scopes: string[] }> {
    const rows = await ctx.db.getCurrent()
      .select({
        tokenKind: tokenTable.tokenKind,
        userId: tokenTable.userId,
        scopeName: tokenScopeTable.scopeName,
      })
      .from(
        tokenTable
      )
      .leftJoin(
        tokenScopeTable,
        eq(tokenScopeTable.tokenId, tokenTable.tokenId)
      )
      .where(
        eq(tokenTable.token, params.token)
      );

    if (rows.length == 0) {
      throw appError(new Unauthenticated());
    }

    let scopes = rows
      .map(row => row.scopeName)
      .filter(scope => scope != null);

    return {
      userId: rows[0]!.userId,
      tokenKind: rows[0]!.tokenKind,
      scopes,
    };
  }

  async createToken(params: { userId: string, tokenKind: "access_token" | "refresh_token", scopes: string[] }, ctx: AccessContext): Promise<TokenEntity> {
    const tokenValue = this.generateTokenValue(32);

    // トークンを登録
    const tokenRows = await ctx.db.getCurrent()
      .insert(
        tokenTable
      )
      .values([
        {
          tokenKind: params.tokenKind,
          userId: params.userId,
          token: tokenValue,
        }
      ])
      .returning({
        tokenId: tokenTable.tokenId,
      });
    const row = tokenRows[0]!;

    // トークンの権限を登録
    const tokenScopes: InferInsertTokenScope[] = params.scopes.map(scope => {
      return {
        tokenId: row.tokenId,
        scopeName: scope,
      };
    });
    await ctx.db.getCurrent()
      .insert(
        tokenScopeTable
      )
      .values([
        ...tokenScopes,
      ]);

    return {
      token: tokenValue,
      scopes: [...params.scopes],
    };
  }

  private static asciiTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
}
