import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
//import { DATABASE } from 'src/constants';
import * as schema from 'src/database/schema';
import { UsersTable } from 'src/database/schema';
import { Profile, ProfileService } from '../profile/profile.service';

export type User = {
  userId: string;
  profiles: Profile[];
};

@Injectable()
export class UserService {
  constructor(
    private readonly profileService: ProfileService,
    //@Inject(DATABASE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async get(userId: string, db: NodePgDatabase<typeof schema>): Promise<User | undefined> {
    const rows = await db.select({
      userId: UsersTable.id,
    }).from(
      UsersTable
    ).where(
      eq(UsersTable.id, userId)
    );

    if (rows.length == 0) {
      return undefined;
    }

    return {
      ...rows[0],
      profiles: await this.profileService.listByUserId(userId, db),
    };
  }
}
