import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Kysely } from 'kysely';
import { DB } from 'src/modules/database/types.gen';

@Injectable()
export class UserService {
  constructor(private readonly db: Kysely<DB>) {}

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
