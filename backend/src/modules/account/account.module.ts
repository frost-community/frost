import { Module } from '@nestjs/common';
import { AccountService } from './account.service';

@Module({
  providers: [AccountService],
  imports: [],
  exports: [AccountService]
})
export class AccountModule {}
