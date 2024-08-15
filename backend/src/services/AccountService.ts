import { and, eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { Account } from '../database/schema';
import { AccountEntity } from '../entities/AccountEntity';
import { Database } from './DatabaseService';
import { UserService } from './UserService';
import { PasswordVerificationService } from './PasswordVerificationService';
import { AccountNotFound, createError, InvalidParam } from '../modules/service-error';

@injectable()
export class AccountService {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService,
    @inject(TYPES.PasswordVerificationService) private readonly passwordVerificationService: PasswordVerificationService,
  ) {}

  async create(params: { name: string }, db: Database): Promise<AccountEntity> {
    const rows = await db.getConnection()
      .insert(
        Account
      )
      .values({
        name: params.name,
        passwordAuthEnabled: true,
      })
      .returning({
        accountId: Account.accountId,
        name: Account.name,
        passwordAuthEnabled: Account.passwordAuthEnabled,
      });
    const account = rows[0]!;
    return {
      ...account,
      users: [],
    };
  }

  async get(params: { accountId?: string, name?: string }, db: Database): Promise<AccountEntity> {
    // either accountId or name must be specified
    if ([params.accountId, params.name].every(x => x == null)) {
      // TODO: エラー内容改善
      throw createError(new AccountNotFound({ accountId: params.accountId, name: params.name }));
    }
    const rows = await db.getConnection()
      .select({
        accountId: Account.accountId,
        name: Account.name,
        passwordAuthEnabled: Account.passwordAuthEnabled,
      })
      .from(
        Account
      )
      .where(
        and(
          eq(Account.accountId, params.accountId ?? Account.accountId),
          eq(Account.accountId, params.name ?? Account.accountId)
        )
      );
    if (rows.length != 1) {
      throw createError(new AccountNotFound({ accountId: params.accountId, name: params.name }));
    }
    const account = rows[0]!;
    return {
      ...account,
      users: await this.userService.listByAccountId({ accountId: account.accountId }, db),
    };
  }

  async delete(params: { accountId: string }, db: Database): Promise<void> {
    const rows = await db.getConnection()
      .delete(
        Account
      )
      .where(
        eq(Account.accountId, params.accountId)
      );
    if (rows.rowCount == 0) {
      throw createError(new AccountNotFound({ accountId: params.accountId }));
    }
  }

  async signup(params: { name: string, password?: string }, db: Database) {
    if (params.password == null) {
      throw createError({ code: 'authMethodRequired', message: 'Authentication method required.', status: 400 });
    }
    const account = await this.create({ name: params.name }, db);
    await this.passwordVerificationService.register({ accountId: account.accountId, password: params.password }, db);
    return { accessToken: 'TODO', account };
  }

  async signin(params: { name: string, password?: string }, db: Database) {
    const account = await this.get({ name: params.name }, db);
    if (account.passwordAuthEnabled) {
      if (params.password == null) {
        throw createError(new InvalidParam([{ path: 'password', message: '"password" field required.' }]));
      }
      const verification = await this.passwordVerificationService.verifyPassword({ accountId: account.accountId, password: params.password }, db);
      if (!verification) {
        throw createError({ code: 'signinFailure', message: 'Signin failure.', status: 401 });
      }
      // TODO: get access token
      return { accessToken: 'TODO', account };
    }
    throw new Error('authentication method not exists: ' + account.accountId);
  }
}
