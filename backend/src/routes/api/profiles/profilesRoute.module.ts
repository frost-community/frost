import { Module } from '@nestjs/common';
import { ProfileModule } from 'src/modules/profile/profile.module';
import { ProfilesRouteController } from './profilesRoute.controller';

@Module({
  // このモジュールに含まれるコントローラー
  controllers: [ProfilesRouteController],

  // 依存モジュール
  imports: [ProfileModule]
})
export class ProfilesRouteModule {}
