import { Controller, Get, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE } from 'src/constants';
import * as schema from 'src/database/schema';
import { Account, AccountService } from 'src/modules/account/account.service';

@Controller('api/me')
export class MeRouteController {
  constructor(
    private readonly accountService: AccountService,
    @Inject(DATABASE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  @Get()
  async getUser(): Promise<Account> {
    // TODO: get accountId of session user
    const accountId = '00000000-0000-0000-0000-000000000001';

    const user = await this.accountService.get(accountId, this.db);

    if (user == null) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
