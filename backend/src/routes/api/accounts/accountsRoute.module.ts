import { Module } from '@nestjs/common';
import { AccountModule } from 'src/modules/account/account.module';
import { AccountsRouteController } from './accountsRoute.controller';

@Module({
  controllers: [AccountsRouteController],
  imports: [AccountModule]
})
export class AccountsRouteModule {}
