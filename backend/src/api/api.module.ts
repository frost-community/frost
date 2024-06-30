import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { MeModule } from './me/me.module';

@Module({
  imports: [AccountsModule, MeModule]
})
export class ApiModule { }
