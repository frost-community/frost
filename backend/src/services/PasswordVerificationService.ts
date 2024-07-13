import { eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import crypto from 'node:crypto';
import { TYPES } from '../container/types';
import { PasswordAuth } from '../database/schema';
import { DatabaseService } from './DatabaseService';

type VerificationInfo = {
  algorithm: string,
  salt: string,
  stretching: number,
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
    const info = this.generateInfo(password);

    const db = this.db.getConnection();
    const rows = await db.insert(
      PasswordAuth
    ).values({
      accountId: accountId,
      algorithm: info.algorithm,
      salt: info.salt,
      stretching: info.stretching,
      hash: info.hash,
    }).returning();

    return rows[0];
  }

  /**
   * パスワードを検証します。
  */
  async verifyPassword(accountId: string, password: string): Promise<boolean> {
    const info = await this.get(accountId);
    if (['sha256'].includes(info.algorithm)) {
      const hash = this.generateHash(password, info.algorithm, info.salt, info.stretching);
      return (hash === info.hash);
    }
    throw new Error('unsupported algorithm'); 
  }

  /**
   * 検証情報を取得します。
  */
  async get(accountId: string): Promise<VerificationInfo> {
    const db = this.db.getConnection();

    const rows = await db.select({
      algorithm: PasswordAuth.algorithm,
      salt: PasswordAuth.salt,
      stretching: PasswordAuth.stretching,
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
  generateInfo(password: string): VerificationInfo {
    const algorithm = 'sha256';
    const salt = this.generateSalt();
    const stretching = 10000;
    const hash = this.generateHash(password, algorithm, salt, stretching);
    return { algorithm, salt, stretching, hash };
  }

  /**
   * 塩を生成します。
  */
  private generateSalt(): string {
    // max length: 32
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * ハッシュを生成します。
  */
  private generateHash(token: string, algorithm: string, salt: string, stretching: number): string {
    if (stretching < 0) {
      throw new Error('validation error: stretching');
    }
    const cryptoHash = crypto.createHash(algorithm);
    for (let i = 0; i < stretching + 1; i++) {
      cryptoHash.update(token + salt);
      token = cryptoHash.digest('hex');
    }
    return token;
  }
}
