import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

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
