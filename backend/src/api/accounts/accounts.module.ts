import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller.js';
import { AccountService } from './account.service.js';

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [AccountService],
})
export class AccountsModule { }
