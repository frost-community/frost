import { eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import { UserEntity } from 'src/entities/UserEntity';
import { TYPES } from '../container/types';
import { User } from '../database/schema';
import { DatabaseService } from './DatabaseService';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.DatabaseService) private readonly db: DatabaseService,
  ) {}

  async create(opts: { accountId: string, name: string, displayName: string }): Promise<UserEntity> {
    const db = this.db.getConnection();

    const rows = await db.insert(
      User
    ).values({
      accountId: opts.accountId,
      name: opts.name,
      displayName: opts.displayName,
    }).returning({
      userId: User.userId,
      name: User.name,
      displayName: User.displayName,
    });

    return rows[0];
  }

  async get(opts: { userId: string }): Promise<UserEntity> {
    const db = this.db.getConnection();

    const rows = await db.select({
      userId: User.userId,
      name: User.name,
      displayName: User.displayName,
    }).from(
      User
    ).where(
      eq(User.userId, opts.userId)
    );

    if (rows.length == 0) {
      throw new Error('not found');
    }

    return rows[0];
  }

  async listByAccountId(accountId: string): Promise<UserEntity[]> {
    const db = this.db.getConnection();

    const rows = await db.select({
      userId: User.userId,
      name: User.name,
      displayName: User.displayName,
    }).from(
      User
    ).where(
      eq(User.accountId, accountId)
    );

    return rows;
  }
}
