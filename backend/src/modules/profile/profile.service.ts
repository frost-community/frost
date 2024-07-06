import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/database/schema';
import { ProfilesTable } from 'src/database/schema';

export type Profile = {
  profileId: string;
  name: string;
};

@Injectable()
export class ProfileService {
  async get(profileId: string, db: NodePgDatabase<typeof schema>): Promise<Profile | undefined> {
    const profileRows = await db
      .select({
        profileId: ProfilesTable.id,
        name: ProfilesTable.name,
      })
      .from(ProfilesTable)
      .where(eq(ProfilesTable.id, profileId));

    if (profileRows.length == 0) {
      return undefined;
    }
    const profileRow = profileRows[0];

    return profileRow;
  }

  async listByUserId(userId: string, db: NodePgDatabase<typeof schema>): Promise<Profile[]> {
    const rows = await db.select({
      profileId: ProfilesTable.id,
      name: ProfilesTable.name,
    }).from(
      ProfilesTable
    ).where(
      eq(ProfilesTable.userId, userId)
    );

    return rows;
  }
}
