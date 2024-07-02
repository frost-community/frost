import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
  getAccountById(accountId: string): Account {
    // TODO: fetch from table
    return {
      accountId: accountId,
      accountName: 'Test Account',
    };
  }
}
