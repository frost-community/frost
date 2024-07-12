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
      userId: User.id,
      name: User.name,
      displayName: User.displayName,
    });

    return rows[0];
  }

  async get(userId: string): Promise<UserEntity | undefined> {
    const db = this.db.getConnection();

    const rows = await db.select({
      userId: User.id,
      name: User.name,
      displayName: User.displayName,
    }).from(
      User
    ).where(
      eq(User.id, userId)
    );

    if (rows.length == 0) {
      return undefined;
    }

    return rows[0];
  }

  async listByAccountId(accountId: string): Promise<UserEntity[]> {
    const db = this.db.getConnection();

    const rows = await db.select({
      userId: User.id,
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
