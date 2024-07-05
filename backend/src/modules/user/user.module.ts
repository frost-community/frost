import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  // このモジュールに含まれるサービス
  providers: [UserService],

  // このモジュールが公開するサービス
  exports: [UserService],

  // 依存モジュール
  imports: [DatabaseModule]
})
export class UserModule {}
