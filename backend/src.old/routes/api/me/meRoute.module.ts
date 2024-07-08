import { Module } from '@nestjs/common';
import { AccountModule } from 'src/.temp/modules/account/account.module';
import { MeRouteController } from './meRoute.controller';

@Module({
  // このモジュールに含まれるコントローラー
  controllers: [MeRouteController],

  // 依存モジュール
  imports: [AccountModule]
})
export class MeRouteModule {}
