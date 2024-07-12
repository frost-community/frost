import { eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import crypto from 'node:crypto';
import { TYPES } from '../container/types';
import { PasswordAuth } from '../database/schema';
import { DatabaseService } from './DatabaseService';

@injectable()
export class PasswordAuthService {
  constructor(
    @inject(TYPES.DatabaseService) private readonly db: DatabaseService,
  ) {}

  private generateSalt(): string {
    // max length: 32
    return crypto.randomBytes(16).toString('hex');
  }

  private generateHash(algorithm: string, salt: string, stretching: number, password: string): string {
    const cryptoHash = crypto.createHash(algorithm);
    let token = password;
    for (let i = 0; i < stretching + 1; i++) {
      cryptoHash.update(token + salt);
      token = cryptoHash.digest('hex');
    }

    return token;
  }

  /**
   * パスワードの検証情報を生成します。
  */
  generateVerificationInfo(password: string): { algorithm: string, salt: string, stretching: number, hash: string } {
    const algorithm = 'sha256';
    const salt = this.generateSalt();
    const stretching = 10000;
    const hash = this.generateHash(algorithm, salt, stretching, password);
    return { algorithm, salt, stretching, hash };
  }

  /**
   * 検証情報を用いてパスワードを検証します。
  */
  verifyPassword(password: string, info: { algorithm: string, salt: string, stretching: number, hash: string }): boolean {
    if (['sha256', 'sha512'].includes(info.algorithm)) {
      const actualyHash = this.generateHash(info.algorithm, info.salt, info.stretching, password);
      return (actualyHash == info.hash);
    }
    throw new Error('unsupported algorithm'); 
  }

  /**
   * パスワード認証情報を生成します。
  */
  async create(accountId: string, info: { algorithm: string, salt: string, hash: string }) {
    const db = this.db.getConnection();

    await db.insert(
      PasswordAuth
    ).values({
      accountId: accountId,
      algorithm: info.algorithm,
      salt: info.salt,
      hash: info.hash,
    }).returning();
  }
}
