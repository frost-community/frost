import { eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { Account, PasswordAuth } from '../database/schema';
import { AccountEntity } from '../entities/AccountEntity';
import { PasswordHash } from '../entities/PasswordHash';
import { DatabaseService } from './DatabaseService';
import { UserService } from './UserService';

@injectable()
export class AccountService {
  constructor(
    @inject(TYPES.DatabaseService) private readonly db: DatabaseService,
    @inject(TYPES.UserService) private readonly userService: UserService,
  ) {}

  async createPasswordAuth(opts: { accountId: string, password: string }) {
    const db = this.db.getConnection();
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

  async create(opts: { name: string, password: string }): Promise<AccountEntity> {
    const db = this.db.getConnection();

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

    await this.createPasswordAuth({ accountId: rows[0].accountId, password: opts.password });

    return {
      ...rows[0],
      users: [],
    };
  }

  async get(accountId: string): Promise<AccountEntity | undefined> {
    const db = this.db.getConnection();

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
      users: await this.userService.listByAccountId(accountId),
    };
  }
}
