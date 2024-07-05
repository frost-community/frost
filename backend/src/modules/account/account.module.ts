import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  // このモジュールに含まれるサービス
  providers: [AccountService],

  // このモジュールが公開するサービス
  exports: [AccountService],

  // 依存モジュール
  imports: [DatabaseModule]
})
export class AccountModule {}
