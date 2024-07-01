import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  // 自身のサービス以外は指定しないでください
  providers: [UserService],

  // 依存モジュール
  imports: []
})
export class UserServiceModule {}
