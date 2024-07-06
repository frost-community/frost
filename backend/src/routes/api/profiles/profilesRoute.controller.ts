import { Controller, Get, HttpException, HttpStatus, Inject, Param } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE } from 'src/constants';
import * as schema from 'src/database/schema';
import { Profile, ProfileService } from 'src/modules/profile/profile.service';

@Controller('api/accounts')
export class ProfilesRouteController {
  constructor(
    private readonly profileService: ProfileService,
    @Inject(DATABASE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  @Get(":id")
  async getAccount(@Param() params: { id: string }): Promise<Profile> {
    const profile = await this.profileService.get(params.id, this.db);

    if (profile == null) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return profile;
  }
}
