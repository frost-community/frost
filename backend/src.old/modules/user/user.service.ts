import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/services/database/schema';
import { User } from 'src/services/database/schema';

export type UserEntity = {
  userId: string;
  name: string;
  displayName: string;
};

@Injectable()
export class UserService {
  async create(opts: { accountId: string, name: string, displayName: string }, db: NodePgDatabase<typeof schema>): Promise<UserEntity> {
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

  async get(userId: string, db: NodePgDatabase<typeof schema>): Promise<UserEntity | undefined> {
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

  async listByAccountId(accountId: string, db: NodePgDatabase<typeof schema>): Promise<UserEntity[]> {
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
