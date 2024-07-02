import { Module } from '@nestjs/common';
import { AccountsRouteModule } from './accounts/accountsRoute.module';
import { MeRouteModule } from './me/meRoute.module';

@Module({
  imports: [
    AccountsRouteModule,
    MeRouteModule
  ]
})
export class ApiRouteModule {}
