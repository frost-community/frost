import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { MeRouteController } from './meRoute.controller';

@Module({
  // このモジュールに含まれるコントローラー
  controllers: [MeRouteController],

  // 依存モジュール
  imports: [UserModule]
})
export class MeRouteModule {}
