import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { DB } from 'src/modules/database/types.gen';
import { Kysely } from 'kysely';

@Injectable()
export class AccountService {
  constructor(private readonly db: Kysely<DB>) {}

  getAccountById(accountId: string): Account {
    // TODO: fetch from table
    return {
      accountId: accountId,
      accountName: 'Test Account',
    };
  }
}
