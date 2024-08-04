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

  async create(params: { accountId: string, name: string, displayName: string }): Promise<UserEntity> {
    const db = this.db.getConnection();

    const rows = await db.insert(
      User
    ).values({
      accountId: params.accountId,
      name: params.name,
      displayName: params.displayName,
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
      throw new Error('userNotFound');
    }

    return rows[0];
  }

  async listByAccountId(params: { accountId: string }): Promise<UserEntity[]> {
    const db = this.db.getConnection();

    const rows = await db.select({
      userId: User.userId,
      name: User.name,
      displayName: User.displayName,
    }).from(
      User
    ).where(
      eq(User.accountId, params.accountId)
    );

    return rows;
  }
}
