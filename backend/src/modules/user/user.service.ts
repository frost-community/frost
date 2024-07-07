import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/database/schema';
import { UserTable } from 'src/database/schema';

export type User = {
  userId: string;
  name: string;
  displayName: string;
};

@Injectable()
export class UserService {
  async create(opts: { accountId: string, name: string, displayName?: string }, db: NodePgDatabase<typeof schema>): Promise<User> {
    const rows = await db.insert(
      UserTable
    ).values({
      accountId: opts.accountId,
      name: opts.name,
      displayName: opts.displayName,
    }).returning({
      userId: UserTable.id,
      name: UserTable.name,
      displayName: UserTable.displayName,
    });

    return rows[0];
  }

  async get(userId: string, db: NodePgDatabase<typeof schema>): Promise<User | undefined> {
    const rows = await db.select({
      userId: UserTable.id,
      name: UserTable.name,
      displayName: UserTable.displayName,
    }).from(
      UserTable
    ).where(
      eq(UserTable.id, userId)
    );

    if (rows.length == 0) {
      return undefined;
    }

    return rows[0];
  }

  async listByAccountId(accountId: string, db: NodePgDatabase<typeof schema>): Promise<User[]> {
    const rows = await db.select({
      userId: UserTable.id,
      name: UserTable.name,
      displayName: UserTable.displayName,
    }).from(
      UserTable
    ).where(
      eq(UserTable.accountId, accountId)
    );

    return rows;
  }
}
