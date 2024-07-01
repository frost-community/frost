import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountServiceModule } from 'src/services/account/accountService.module';

@Module({
  // 自身のコントローラー以外は指定しないでください
  controllers: [AccountsController],

  // 依存モジュール
  imports: [AccountServiceModule]
})
export class AccountsControllerModule {}
