import { injectable } from "inversify";
import { AccessContext } from "../types/access-context";
import { TokenEntity } from "../types/entities";
import { CreateTokenScopeParameters, tokenScopeTable, tokenTable } from "../database/schema";

export type TokenKind = "access_token" | "refresh_token";

@injectable()
export class TokenRepository {
  async create(params: { userId: string, tokenKind: TokenKind, scopes: string[], token: string, }, ctx: AccessContext): Promise<TokenEntity> {
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
    const tokenScopes: CreateTokenScopeParameters[] = params.scopes.map(scope => {
      return {
        tokenId: token.tokenId,
        scopeName: scope,
      };
    });
    await ctx.db.getCurrent()
      .insert(tokenScopeTable)
      .values(tokenScopes);

    return {
      token: params.token,
      scopes: [...params.scopes],
    };
  }

  // TODO: get()

  // TODO: delete()
}
