import { eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { Account } from '../database/schema';
import { AccountEntity } from '../entities/AccountEntity';
import { DatabaseService } from './DatabaseService';
import { UserService } from './UserService';
import { PasswordVerificationService } from './PasswordVerificationService';
import { AccountNotFound, createError } from '../modules/service-error';

@injectable()
export class AccountService {
  constructor(
    @inject(TYPES.DatabaseService) private readonly db: DatabaseService,
    @inject(TYPES.UserService) private readonly userService: UserService,
    @inject(TYPES.PasswordVerificationService) private readonly passwordVerificationService: PasswordVerificationService,
  ) {}

  async create(params: { name: string, password: string }): Promise<AccountEntity> {
    const db = this.db.getConnection();

    const rows = await db.insert(
      Account
    ).values({
      name: params.name,
      passwordAuthEnabled: true,
    }).returning({
      accountId: Account.accountId,
      name: Account.name,
      passwordAuthEnabled: Account.passwordAuthEnabled,
    });
    const accountId = rows[0].accountId;

    await this.passwordVerificationService.register({ accountId, password: params.password });

    return {
      ...rows[0],
      users: [],
    };
  }

  async get(params: { accountId: string }): Promise<AccountEntity> {
    const db = this.db.getConnection();

    const rows = await db.select({
      accountId: Account.accountId,
      name: Account.name,
      passwordAuthEnabled: Account.passwordAuthEnabled,
    }).from(
      Account
    ).where(
      eq(Account.accountId, params.accountId)
    );

    if (rows.length == 0) {
      throw createError(new AccountNotFound({ accountId: params.accountId }));
    }

    return {
      ...rows[0],
      users: await this.userService.listByAccountId({ accountId: params.accountId }),
    };
  }

  async delete(params: { accountId: string }): Promise<void> {
    const db = this.db.getConnection();

    const rows = await db.delete(
      Account
    ).where(
      eq(Account.accountId, params.accountId)
    );

    if (rows.rowCount == 0) {
      throw createError(new AccountNotFound({ accountId: params.accountId }));
    }
  }
}
