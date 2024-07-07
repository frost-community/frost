import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/database/schema';
import { AccountTable } from 'src/database/schema';
import { User, UserService } from '../user/user.service';

export type Account = {
  accountId: string;
  accountName?: string;
  passwordAuthEnabled?: boolean;
  users: User[];
};

@Injectable()
export class AccountService {
  constructor(
    private readonly profileService: UserService,
  ) {}

  async create(opts: { password: string }, db: NodePgDatabase<typeof schema>): Promise<Account> {
    // TODO: save credential
    const rows = await db.insert(
      AccountTable
    ).values({
    }).returning();

    return {
      ...rows[0],
      users: [],
    };
  }

  async get(accountId: string, db: NodePgDatabase<typeof schema>): Promise<Account | undefined> {
    const rows = await db.select({
      accountId: AccountTable.id,
    }).from(
      AccountTable
    ).where(
      eq(AccountTable.id, accountId)
    );

    if (rows.length == 0) {
      return undefined;
    }

    return {
      ...rows[0],
      users: await this.profileService.listByAccountId(accountId, db),
    };
  }
}
