import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Module({
  // このモジュールに含まれるサービス
  providers: [ProfileService],

  // このモジュールが公開するサービス
  exports: [ProfileService],

  // 依存モジュール
  imports: []
})
export class ProfileModule {}
