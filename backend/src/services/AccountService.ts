import { eq } from 'drizzle-orm';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { Account } from '../database/schema';
import { AccountEntity } from '../entities/AccountEntity';
import { DatabaseService } from './DatabaseService';
import { UserService } from './UserService';
import { PasswordAuthService } from './PasswordAuthService';

@injectable()
export class AccountService {
  constructor(
    @inject(TYPES.DatabaseService) private readonly db: DatabaseService,
    @inject(TYPES.UserService) private readonly userService: UserService,
    @inject(TYPES.PasswordAuthService) private readonly passwordAuthService: PasswordAuthService,
  ) {}

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
    const accountId = rows[0].accountId;

    // password
    const verificationInfo = this.passwordAuthService.generateVerificationInfo(opts.password);
    await this.passwordAuthService.create(accountId, verificationInfo);

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
