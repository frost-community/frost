import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { AccountServiceModule } from 'src/services/account/accountService.module';
import { UserServiceModule } from 'src/services/user/userService.module';

@Module({
  // 自身のコントローラー以外は指定しないでください
  controllers: [MeController],

  // 依存モジュール
  imports: [UserServiceModule, AccountServiceModule]
})
export class MeControllerModule {}
