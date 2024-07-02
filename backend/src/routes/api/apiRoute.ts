import { Module } from '@nestjs/common';
import { AccountsRouteModule } from './accounts/accountsRoute';
import { MeRouteModule } from './me/meRoute';

@Module({
  imports: [
    AccountsRouteModule,
    MeRouteModule
  ]
})
export class ApiRouteModule {}
