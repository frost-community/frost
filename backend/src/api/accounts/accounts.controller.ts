import { Controller, Get } from '@nestjs/common';
import { Account, AccountService } from './account.service.js';

@Controller()
export class AccountsController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  getAccount(): Account {
    return this.accountService.getAccountById('testUser');
  }
}
