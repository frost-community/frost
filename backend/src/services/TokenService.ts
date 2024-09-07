import { Container } from "inversify";
import crypto from "node:crypto";
import { AccessContext } from "../modules/AccessContext";
import { appError, BadRequest, Unauthenticated } from "../modules/appErrors";
import { TokenEntity } from "../modules/entities";
import * as TokenRepository from "../repositories/TokenRepository";

const asciiTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export async function create(
  params: { userId: string, tokenKind: TokenRepository.TokenKind, scopes: string[] },
  ctx: AccessContext,
  container: Container,
): Promise<TokenEntity> {
  const tokenValue = await generateTokenValue(32);

  const tokenEntity = await TokenRepository.create({
    userId: params.userId,
    tokenKind: params.tokenKind,
    scopes: params.scopes,
    token: tokenValue,
  }, ctx, container);

  return tokenEntity;
}

export async function getTokenInfo(
  params: { token: string },
  ctx: AccessContext,
  container: Container,
): Promise<{ tokenKind: TokenRepository.TokenKind, userId: string, scopes: string[] }> {
  if (params.token.length < 1) {
    throw appError(new BadRequest([
      { message: 'token invalid.' },
    ]));
  }
  const info = await TokenRepository.get({
    token: params.token,
  }, ctx, container);
  if (info == null) {
    throw appError(new Unauthenticated());
  }
  return info;
}

/**
 * @internal
*/
export async function generateTokenValue(length: number) {
  let token = "";
  for (const [_index, byte] of crypto.randomBytes(length).entries()) {
    token += asciiTable[byte % asciiTable.length];
  }
  return token;
}
