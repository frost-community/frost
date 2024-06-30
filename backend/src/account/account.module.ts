import { Module } from '@nestjs/common';
import { AccountService } from './account.service';

@Module({
  imports: [],
  providers: [AccountService]
})
export class AccountModule {}
