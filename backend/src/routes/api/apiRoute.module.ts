import { Module } from '@nestjs/common';
import { AccountsRouteModule } from './accounts/accountsRoute.module';
import { MeRouteModule } from './me/meRoute.module';

@Module({
  // このモジュールに含まれるコントローラー
  controllers: [],

  // 依存モジュール
  imports: [
    AccountsRouteModule,
    MeRouteModule
  ]
})
export class ApiRouteModule {}
