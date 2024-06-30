import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountService } from 'src/account/account.service';

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [AccountService]
})
export class AccountsModule {}
