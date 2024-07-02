import { Controller, Get, Param } from '@nestjs/common';
import { Account } from 'src/modules/account/account.entity';
import { AccountService } from 'src/modules/account/account.service';

@Controller('api/accounts')
export class AccountsRouteController {
  constructor(private readonly accountService: AccountService) {}

  @Get(":id")
  getAccount(@Param() params: { id: string }): Account {
    return this.accountService.getAccountById(params.id);
  }
}
