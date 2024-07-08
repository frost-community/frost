import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/database/schema';
import { Account } from 'src/database/schema';
import { PasswordAuth } from 'src/database/schema';
import { UserEntity, UserService } from '../user/user.service';
import { PasswordHash } from '../passwordHash/passwordHash';

export type AccountEntity = {
  accountId: string;
  name: string;
  passwordAuthEnabled: boolean;
  users: UserEntity[];
};

@Injectable()
export class AccountService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async createPasswordAuth(opts: { accountId: string, password: string }, db: NodePgDatabase<typeof schema>) {
    const passwordHash = PasswordHash.generate(opts.password);

    await db.insert(
      PasswordAuth
    ).values({
      accountId: opts.accountId,
      algorithm: passwordHash.algorithm,
      salt: passwordHash.salt,
      hash: passwordHash.hash,
    }).returning();
  }

  async create(opts: { name: string, password: string }, db: NodePgDatabase<typeof schema>): Promise<AccountEntity> {
    const rows = await db.insert(
      Account
    ).values({
      name: opts.name,
      passwordAuthEnabled: true,
    }).returning({
      accountId: Account.id,
      name: Account.name,
      passwordAuthEnabled: Account.passwordAuthEnabled,
    });

    await this.createPasswordAuth({ accountId: rows[0].accountId, password: opts.password }, db);

    return {
      ...rows[0],
      users: [],
    };
  }

  async get(accountId: string, db: NodePgDatabase<typeof schema>): Promise<AccountEntity | undefined> {
    Account.passwordAuthEnabled;
    const rows = await db.select({
      accountId: Account.id,
      name: Account.name,
      passwordAuthEnabled: Account.passwordAuthEnabled,
    }).from(
      Account
    ).where(
      eq(Account.id, accountId)
    );

    if (rows.length == 0) {
      return undefined;
    }

    return {
      ...rows[0],
      users: await this.userService.listByAccountId(accountId, db),
    };
  }
}
