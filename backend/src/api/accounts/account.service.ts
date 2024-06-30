import { Injectable } from '@nestjs/common';

export type User = {
  userId: string;
};

export type Account = {
  // userId: string,
  accountId: string;
  accountName: string;
};

@Injectable()
export class AccountService {
  getAccountById(accountId: string): Account {
    // TODO
    return {
      accountId: accountId,
      accountName: accountId,
    };
  }
}
