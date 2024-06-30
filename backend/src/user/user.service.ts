import { Injectable } from '@nestjs/common';
import { Account } from 'src/account/account.service';

export type User = {
  userId: string;
  accounts: Account[];
};

@Injectable()
export class UserService {
  GetUser(userId: string): User {
    // TODO: fetch from table
    return {
      userId: userId,
      accounts: [
        { accountId: '1', accountName: 'Test Account 1' },
        { accountId: '2', accountName: 'Test Account 2' }
      ]
    };
  }
}
