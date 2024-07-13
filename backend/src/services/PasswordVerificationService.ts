import { eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import crypto from 'node:crypto';
import { TYPES } from '../container/types';
import { PasswordAuth } from '../database/schema';
import { DatabaseService } from './DatabaseService';

type VerificationInfo = {
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
   * 検証情報を作成します。
  */
  async create(accountId: string, password: string): Promise<VerificationInfo> {
    const info = this.generateVerificationInfo(password);

    const db = this.db.getConnection();
    const rows = await db.insert(
      PasswordAuth
    ).values({
      accountId: accountId,
      algorithm: info.algorithm,
      salt: info.salt,
      iteration: info.iteration,
      hash: info.hash,
    }).returning();

    return rows[0];
  }

  /**
   * パスワードを検証します。
  */
  async verifyPassword(accountId: string, password: string): Promise<boolean> {
    const info = await this.get(accountId);
    const hash = this.generateHash(password, info.algorithm, info.salt, info.iteration);
    return (hash === info.hash);
  }

  /**
   * 検証情報を取得します。
  */
  async get(accountId: string): Promise<VerificationInfo> {
    const db = this.db.getConnection();
    const rows = await db.select({
      algorithm: PasswordAuth.algorithm,
      salt: PasswordAuth.salt,
      iteration: PasswordAuth.iteration,
      hash: PasswordAuth.hash,
    }).from(
      PasswordAuth
    ).where(
      eq(PasswordAuth.accountId, accountId)
    );

    if (rows.length == 0) {
      throw new Error('not found');
    }

    return rows[0];
  }

  /**
   * パスワード認証情報を生成します。
  */
  generateVerificationInfo(password: string): VerificationInfo {
    const algorithm = 'sha256';
    const salt = this.generateSalt();
    const iteration = 100000;
    const hash = this.generateHash(password, algorithm, salt, iteration);
    return { algorithm, salt, iteration, hash };
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
