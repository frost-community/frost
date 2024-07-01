import { Module } from '@nestjs/common';
import { AccountService } from './account.service';

@Module({
  // 自身のサービス以外は指定しないでください
  providers: [AccountService],

  // 依存モジュール
  imports: []
})
export class AccountServiceModule {}
