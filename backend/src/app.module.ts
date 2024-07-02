import { Module } from '@nestjs/common';
import { RootRouteModule } from './routes/rootRoute.module';

@Module({
  // 依存モジュール
  imports: [RootRouteModule]
})
export class AppModule { }
