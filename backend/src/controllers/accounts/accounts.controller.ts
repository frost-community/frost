import { Controller, Get, Param } from '@nestjs/common';
import { Account, AccountService } from '../../services/account/account.service';

@Controller('api/accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountService) {}

  @Get(":id")
  getAccount(@Param() params: { id: string }): Account {
    return this.accountService.getAccountById(params.id);
  }
}
