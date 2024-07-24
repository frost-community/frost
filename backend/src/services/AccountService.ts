import { eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { Account } from '../database/schema';
import { AccountEntity } from '../entities/AccountEntity';
import { DatabaseService } from './DatabaseService';
import { UserService } from './UserService';
import { PasswordVerificationService } from './PasswordVerificationService';

@injectable()
export class AccountService {
  constructor(
    @inject(TYPES.DatabaseService) private readonly db: DatabaseService,
    @inject(TYPES.UserService) private readonly userService: UserService,
    @inject(TYPES.PasswordVerificationService) private readonly passwordVerificationService: PasswordVerificationService,
  ) {}

  async create(opts: { name: string, password: string }): Promise<AccountEntity> {
    const db = this.db.getConnection();

    const rows = await db.insert(
      Account
    ).values({
      name: opts.name,
      passwordAuthEnabled: true,
    }).returning({
      accountId: Account.accountId,
      name: Account.name,
      passwordAuthEnabled: Account.passwordAuthEnabled,
    });
    const accountId = rows[0].accountId;

    await this.passwordVerificationService.register(accountId, opts.password);

    return {
      ...rows[0],
      users: [],
    };
  }

  async get(opts: { accountId: string }): Promise<AccountEntity> {
    const db = this.db.getConnection();

    const rows = await db.select({
      accountId: Account.accountId,
      name: Account.name,
      passwordAuthEnabled: Account.passwordAuthEnabled,
    }).from(
      Account
    ).where(
      eq(Account.accountId, opts.accountId)
    );

    if (rows.length == 0) {
      throw new Error('not found');
    }

    return {
      ...rows[0],
      users: await this.userService.listByAccountId(opts.accountId),
    };
  }
}
