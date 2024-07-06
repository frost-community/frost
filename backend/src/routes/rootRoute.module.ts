import { Module } from '@nestjs/common';
import { ApiRouteModule } from './api/apiRoute.module';

@Module({
  // このモジュールに含まれるコントローラー
  controllers: [],

  // 依存モジュール
  imports: [ApiRouteModule]
})
export class RootRouteModule {}
