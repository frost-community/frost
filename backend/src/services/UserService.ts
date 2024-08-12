import { and, eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import { UserEntity } from '../entities/UserEntity';
import { TYPES } from '../container/types';
import { User } from '../database/schema';
import { DatabaseService } from './DatabaseService';
import { createError, UserNotFound } from '../modules/service-error';

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
    const row = rows[0]!;

    return row;
  }

  async get(opts: { userId?: string, name?: string }): Promise<UserEntity> {
    const db = this.db.getConnection();

    // either userId or name must be specified
    if ([opts.userId, opts.name].every(x => x == null)) {
      throw createError(new UserNotFound({ userId: opts.userId, userName: opts.name }));
    }

    const rows = await db.select({
      userId: User.userId,
      name: User.name,
      displayName: User.displayName,
    }).from(
      User
    ).where(
      and(
        eq(User.userId, opts.userId != null ? opts.userId : User.userId),
        eq(User.name, opts.name != null ? opts.name : User.name)
      )
    );

    if (rows.length == 0) {
      throw createError(new UserNotFound({ userId: opts.userId }));
    }
    const row = rows[0]!;

    return row;
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

  async delete(params: { userId: string }): Promise<void> {
    const db = this.db.getConnection();

    const rows = await db.delete(
      User
    ).where(
      eq(User.userId, params.userId)
    );

    if (rows.rowCount == 0) {
      throw createError(new UserNotFound({ userId: params.userId }));
    }
  }
}
