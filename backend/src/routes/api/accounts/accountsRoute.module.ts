import { Module } from '@nestjs/common';
import { AccountModule } from 'src/modules/account/account.module';
import { AccountsRouteController } from './accountsRoute.controller';

@Module({
  // このモジュールに含まれるコントローラー
  controllers: [AccountsRouteController],

  // 依存モジュール
  imports: [AccountModule]
})
export class AccountsRouteModule {}