import { eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import crypto from 'node:crypto';
import { TYPES } from '../container/types';
import { PasswordVerification, InferSelectPasswordVerification } from '../database/schema';
import { Database } from './DatabaseService';
import { AccountNotFound, createError } from '../modules/service-error';

/**
 * パスワード検証情報
*/
type PasswordVerificationInfo = {
  algorithm: string,
  salt: string,
  iteration: number,
  hash: string,
};

@injectable()
export class PasswordVerificationService {
  constructor(
  ) {}

  /**
   * パスワードの検証情報を登録します。
  */
  async register(params: { accountId: string, password: string }, db: Database): Promise<void> {
    const info = this.generateVerificationInfo({ password: params.password });

    await db.getConnection()
      .insert(
        PasswordVerification
      )
      .values({
        accountId: params.accountId,
        algorithm: info.algorithm,
        salt: info.salt,
        iteration: info.iteration,
        hash: info.hash,
      });
  }

  /**
   * 検証情報からパスワードを検証します。
  */
  async verifyPassword(params: { accountId: string, password: string }, db: Database): Promise<boolean> {
    const info = await this.get({ accountId: params.accountId }, db);
    const hash = this.generateHash({ token: params.password, algorithm: info.algorithm, salt: info.salt, iteration: info.iteration });
    return (hash === info.hash);
  }

  /**
   * 検証情報を取得します。
  */
  private async get(params: { accountId: string }, db: Database): Promise<InferSelectPasswordVerification> {
    const rows = await db.getConnection()
      .select()
      .from(
        PasswordVerification
      )
      .where(
        eq(PasswordVerification.accountId, params.accountId)
      );

    if (rows.length == 0) {
      throw createError(new AccountNotFound({ accountId: params.accountId }));
    }

    const row = rows[0]!;

    return row;
  }

  /**
   * パスワード認証情報を生成します。
  */
  private generateVerificationInfo(params: { password: string }): PasswordVerificationInfo {
    const algorithm = 'sha256';
    const salt = this.generateSalt();
    const iteration = 100000;
    const hash = this.generateHash({ token: params.password, algorithm, salt, iteration });
    return {
      algorithm,
      salt,
      iteration,
      hash,
    };
  }

  /**
   * 塩を生成します。
  */
  private generateSalt(): string {
    // 128bit random (length = 32)
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * ハッシュを生成します。
  */
  private generateHash(params: { token: string, algorithm: string, salt: string, iteration: number }): string {
    if (params.iteration < 1) {
      throw new Error('validation error: iteration');
    }

    let token = params.token;
    for (let i = 0; i < params.iteration; i++) {
      token = crypto.hash(params.algorithm, token + params.salt, 'hex');
    }

    return token;
  }
}
