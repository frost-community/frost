import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [ApiModule, UserModule, AccountModule]
})
export class AppModule { }
