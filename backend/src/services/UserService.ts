import { and, eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { Database } from './DatabaseService';
import { User } from '../database/schema';
import { UserEntity } from '../entities/UserEntity';
import { createError, UserNotFound } from '../modules/service-error';

@injectable()
export class UserService {
  constructor(
  ) {}

  async create(params: { accountId: string, name: string, displayName: string }, db: Database): Promise<UserEntity> {

    const rows = await db.getConnection()
      .insert(
        User
      )
      .values({
        accountId: params.accountId,
        name: params.name,
        displayName: params.displayName,
      })
      .returning({
        userId: User.userId,
        name: User.name,
        displayName: User.displayName,
      });
    const row = rows[0]!;

    return row;
  }

  async get(opts: { userId?: string, name?: string }, db: Database): Promise<UserEntity> {
    // either userId or name must be specified
    if ([opts.userId, opts.name].every(x => x == null)) {
      throw createError(new UserNotFound({ userId: opts.userId, userName: opts.name }));
    }

    const rows = await db.getConnection()
      .select({
        userId: User.userId,
        name: User.name,
        displayName: User.displayName,
      })
      .from(
        User
      )
      .where(
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

  async listByAccountId(params: { accountId: string }, db: Database): Promise<UserEntity[]> {
    const rows = await db.getConnection()
      .select({
        userId: User.userId,
        name: User.name,
        displayName: User.displayName,
      })
      .from(
        User
      )
      .where(
        eq(User.accountId, params.accountId)
      );

    return rows;
  }

  async delete(params: { userId: string }, db: Database): Promise<void> {
    const rows = await db.getConnection()
      .delete(
        User
      )
      .where(
        eq(User.userId, params.userId)
      );

    if (rows.rowCount == 0) {
      throw createError(new UserNotFound({ userId: params.userId }));
    }
  }
}
