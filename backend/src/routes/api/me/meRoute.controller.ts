import { Controller, Get, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE } from 'src/constants';
import * as schema from 'src/database/schema';
import { User, UserService } from 'src/modules/user/user.service';

@Controller('api/me')
export class MeRouteController {
  constructor(
    private readonly userService: UserService,
    @Inject(DATABASE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  @Get()
  async getUser(): Promise<User> {
    // TODO: get userId of session user
    const userId = '0000000-0000-0000-0000-000000000001';

    const user = await this.userService.get(userId, this.db);

    if (user == null) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
