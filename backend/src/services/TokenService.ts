import { inject, injectable } from "inversify";
import crypto from "node:crypto";
import { TYPES } from "../container/types";
import { appError, BadRequest, Unauthenticated } from "../modules/appErrors";
import { TokenKind, TokenRepository } from "../repositories/TokenRepository";
import { AccessContext } from "../types/access-context";
import { TokenEntity } from "../types/entities";

@injectable()
export class TokenService {
  constructor(
    @inject(TYPES.TokenRepository) private readonly tokenRepository: TokenRepository,
  ) {}

  public async create(params: { userId: string, tokenKind: TokenKind, scopes: string[] }, ctx: AccessContext): Promise<TokenEntity> {
    const tokenValue = this.generateTokenValue(32);
    const tokenEntity = await this.tokenRepository.create({
      userId: params.userId,
      tokenKind: params.tokenKind,
      scopes: params.scopes,
      token: tokenValue,
    }, ctx);
    return tokenEntity;
  }

  public async getTokenInfo(params: { token: string }, ctx: AccessContext): Promise<{ tokenKind: TokenKind, userId: string, scopes: string[] }> {
    if (params.token.length < 1) {
      throw appError(new BadRequest([
        { message: 'token invalid.' },
      ]));
    }
    const info = await this.tokenRepository.get({
      token: params.token,
    }, ctx);
    if (info == null) {
      throw appError(new Unauthenticated());
    }
    return info;
  }

  /**
   * @internal
  */
  public generateTokenValue(length: number) {
    let token = "";
    for (const [_index, byte] of crypto.randomBytes(length).entries()) {
      token += TokenService.asciiTable[byte % TokenService.asciiTable.length];
    }
    return token;
  }

  private static asciiTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
}
