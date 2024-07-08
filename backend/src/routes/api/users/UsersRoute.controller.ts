import { Controller, Get, HttpException, HttpStatus, Inject, Param } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE } from 'src/constants';
import * as schema from 'src/database/schema';
import { UserEntity, UserService } from 'src/modules/user/user.service';

@Controller('api/users')
export class UsersRouteController {
  constructor(
    private readonly userService: UserService,
    @Inject(DATABASE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  @Get(":id")
  async getUser(@Param() params: { id: string }): Promise<UserEntity> {
    const user = await this.userService.get(params.id, this.db);

    if (user == null) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
