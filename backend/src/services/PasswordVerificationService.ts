import { Container } from "inversify";
import crypto from "node:crypto";
import { AccessContext } from "../modules/AccessContext";
import { appError, BadRequest } from "../modules/appErrors";
import * as PasswordVerificationRepository from "../repositories/PasswordVerificationRepository";

type PasswordVerificationInfo = {
  algorithm: string,
  salt: string,
  iteration: number,
  hash: string,
};

/**
 * パスワードの検証情報を作成します。
*/
export async function create(
  params: { userId: string, password: string },
  ctx: AccessContext,
  container: Container,
): Promise<void> {
  if (params.password.length < 8) {
    throw appError(new BadRequest([
      { message: 'password invalid.' },
    ]));
  }
  await PasswordVerificationRepository.create({
    userId: params.userId,
    ...generateInfo({
      password: params.password,
    }),
  }, ctx, container);
}

/**
 * パスワード検証情報を用いてパスワードが正しいかどうかを確認します。
*/
export async function verifyPassword(
  params: { userId: string, password: string },
  ctx: AccessContext,
  container: Container,
): Promise<boolean> {
  if (params.password.length < 1) {
    throw appError(new BadRequest([
      { message: 'password invalid.' },
    ]));
  }
  const info = await PasswordVerificationRepository.get({
    userId: params.userId,
  }, ctx, container);
  if (info == null) {
    throw new Error("PasswordVerification record not found");
  }
  const hash = generateHash({
    token: params.password,
    algorithm: info.algorithm,
    salt: info.salt,
    iteration: info.iteration,
  });
  return (hash === info.hash);
}

/**
 * パスワード認証情報を生成します。
 * @internal
*/
export function generateInfo(params: { password: string }): PasswordVerificationInfo {
  const algorithm = "sha256";
  const salt = generateSalt();
  const iteration = 100000;
  const hash = generateHash({
    token: params.password,
    algorithm,
    salt,
    iteration,
  });
  return {
    algorithm,
    salt,
    iteration,
    hash,
  };
}

/**
 * ハッシュを生成します。
 * @internal
*/
export function generateHash(params: { token: string, algorithm: string, salt: string, iteration: number }): string {
  if (params.iteration < 1) {
    throw new Error("The iteration value must be 1 or greater");
  }
  let token = params.token;
  for (let i = 0; i < params.iteration; i++) {
    token = crypto.hash(params.algorithm, token + params.salt, "hex");
  }
  return token;
}

/**
 * 塩を生成します。
 * @internal
*/
export function generateSalt(): string {
  // 128bit random (length = 32)
  return crypto.randomBytes(16).toString("hex");
}
