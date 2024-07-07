import { Module } from '@nestjs/common';
import { MeRouteModule } from './me/meRoute.module';
import { UsersRouteModule } from './users/UsersRoute.module';

@Module({
  // このモジュールに含まれるコントローラー
  controllers: [],

  // 依存モジュール
  imports: [
    UsersRouteModule,
    MeRouteModule
  ]
})
export class ApiRouteModule {}
