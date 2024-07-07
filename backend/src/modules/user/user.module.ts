import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  // このモジュールに含まれるサービス
  providers: [UserService],

  // このモジュールが公開するサービス
  exports: [UserService],

  // 依存モジュール
  imports: []
})
export class UserModule {}
