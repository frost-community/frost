import { Module } from '@nestjs/common';
import { AccountModule } from 'src/modules/account/account.module';
import { MeRouteController } from './meRoute.controller';

@Module({
  // このモジュールに含まれるコントローラー
  controllers: [MeRouteController],

  // 依存モジュール
  imports: [AccountModule]
})
export class MeRouteModule {}
