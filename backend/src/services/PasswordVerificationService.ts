import { eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import crypto from 'node:crypto';
import { TYPES } from '../container/types';
import { PasswordVerification, PasswordVerificationRow } from '../database/schema';
import { DatabaseService } from './DatabaseService';

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
    @inject(TYPES.DatabaseService) private readonly db: DatabaseService,
  ) {}

  /**
   * パスワードの検証情報を登録します。
  */
  async register(accountId: string, password: string): Promise<void> {
    const info = this.generateVerificationInfo(password);

    const db = this.db.getConnection();
    await db.insert(
      PasswordVerification
    ).values({
      accountId: accountId,
      algorithm: info.algorithm,
      salt: info.salt,
      iteration: info.iteration,
      hash: info.hash,
    });
  }

  /**
   * 検証情報からパスワードを検証します。
  */
  async verifyPassword(accountId: string, password: string): Promise<boolean> {
    const info = await this.get(accountId);
    const hash = this.generateHash(password, info.algorithm, info.salt, info.iteration);
    return (hash === info.hash);
  }

  /**
   * 検証情報を取得します。
  */
  private async get(accountId: string): Promise<PasswordVerificationRow> {
    const db = this.db.getConnection();
    const rows = await db.select().from(
      PasswordVerification
    ).where(
      eq(PasswordVerification.accountId, accountId)
    );

    if (rows.length == 0) {
      throw new Error('not found');
    }

    return rows[0];
  }

  /**
   * パスワード認証情報を生成します。
  */
  private generateVerificationInfo(password: string): PasswordVerificationInfo {
    const algorithm = 'sha256';
    const salt = this.generateSalt();
    const iteration = 100000;
    const hash = this.generateHash(password, algorithm, salt, iteration);
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
  private generateHash(token: string, algorithm: string, salt: string, iteration: number): string {
    if (iteration < 1) {
      throw new Error('validation error: iteration');
    }

    for (let i = 0; i < iteration; i++) {
      token = crypto.hash(algorithm, token + salt, 'hex');
    }

    return token;
  }
}
