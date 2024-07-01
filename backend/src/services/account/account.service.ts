import { Injectable } from '@nestjs/common';

export type Account = {
  // userId: string,
  accountId: string;
  accountName: string;
};

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
