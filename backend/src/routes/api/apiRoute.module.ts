import { Module } from '@nestjs/common';
import { MeRouteModule } from './me/meRoute.module';
import { ProfilesRouteModule } from './profiles/profilesRoute.module';

@Module({
  // このモジュールに含まれるコントローラー
  controllers: [],

  // 依存モジュール
  imports: [
    ProfilesRouteModule,
    MeRouteModule
  ]
})
export class ApiRouteModule {}
