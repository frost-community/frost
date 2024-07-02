import { Controller, Get, Module, Param } from '@nestjs/common';
import { Account } from 'src/modules/account/account.entity';
import { AccountModule } from 'src/modules/account/account.module';
import { AccountService } from 'src/modules/account/account.service';

@Controller('api/accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountService) {}

  @Get(":id")
  getAccount(@Param() params: { id: string }): Account {
    return this.accountService.getAccountById(params.id);
  }
}

@Module({
  controllers: [AccountsController],
  imports: [AccountModule]
})
export class AccountsRouteModule {}
