import crypto from 'node:crypto';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { Database, DatabaseService } from './DatabaseService';
import { InferInsertTokenScope, Token, TokenScope } from '../database/schema';
import { TokenEntity } from '../modules/entities';

@injectable()
export class TokenService {
  constructor(
  ) {}

  private generateTokenValue(length: number) {
    let token = '';
    for (const [_index, byte] of crypto.randomBytes(length).entries()) {
      token += TokenService.asciiTable[byte % TokenService.asciiTable.length];
    }
    return token;
  }

  async createToken(params: { userId: string, tokenKind: 'access_token' | 'refresh_token', scopes: string[] }, db: Database): Promise<TokenEntity> {
    const tokenValue = this.generateTokenValue(32);

    // トークンを登録
    const tokenRows = await db.getConnection()
      .insert(
        Token
      )
      .values([
        {
          tokenKind: params.tokenKind,
          userId: params.userId,
          token: tokenValue,
        }
      ])
      .returning({
        tokenId: Token.tokenId,
      });
    const row = tokenRows[0]!;

    // トークンの権限を登録
    const tokenScopes: InferInsertTokenScope[] = params.scopes.map(scope => {
      return {
        tokenId: row.tokenId,
        scopeName: scope,
      };
    });
    await db.getConnection()
      .insert(
        TokenScope
      )
      .values([
        ...tokenScopes,
      ]);

    return {
      token: tokenValue,
      scopes: [...params.scopes],
    };
  }

  private static asciiTable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
}
