import crypto from 'node:crypto';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { Database, DatabaseService } from './DatabaseService';
import { InferInsertTokenScope, Token, TokenScope } from '../database/schema';

@injectable()
export class TokenService {
  constructor(
  ) {}

  generateTokenValue(length: number) {
    let token = '';
    for (const [_index, byte] of crypto.randomBytes(length).entries()) {
      token += TokenService.asciiTable[byte % TokenService.asciiTable.length];
    }
    return token;
  }

  async createToken(params: { userId: string, tokenKind: 'access_token' | 'refresh_token', scopes: string[] }, db: Database) {
    const token = this.generateTokenValue(32);

    // トークンを登録
    const tokenRows = await db.getConnection()
      .insert(
        Token
      )
      .values([
        {
          tokenKind: params.tokenKind,
          userId: params.userId,
          token: token,
        }
      ])
      .returning({
        tokenId: Token.tokenId,
      });
    const accessTokenId = tokenRows[0]!.tokenId;
    const refreshTokenId = tokenRows[1]!.tokenId;

    // トークンの権限を登録
    const accessTokenScopes: InferInsertTokenScope[] = params.scopes.map(scope => {
      return {
        tokenId: accessTokenId,
        scopeName: scope,
      };
    });
    await db.getConnection()
      .insert(
        TokenScope
      )
      .values([
        ...accessTokenScopes,
      ]);

    db.release();

    return {
      token,
      scopes: [...params.scopes],
    };
  }

  private static asciiTable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
}
