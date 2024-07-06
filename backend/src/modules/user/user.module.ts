import { Module } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module';
import { UserService } from './user.service';

@Module({
  // このモジュールに含まれるサービス
  providers: [UserService],

  // このモジュールが公開するサービス
  exports: [UserService],

  // 依存モジュール
  imports: [ProfileModule]
})
export class UserModule {}
