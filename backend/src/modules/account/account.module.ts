import { Module } from '@nestjs/common';
import { AccountService } from './account.service';

@Module({
  // このモジュールに含まれるサービス
  providers: [AccountService],

  // このモジュールが公開するサービス
  exports: [AccountService],

  // 依存モジュール
  imports: []
})
export class AccountModule {}
