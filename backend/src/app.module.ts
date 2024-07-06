import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { Module } from '@nestjs/common';
import * as schema from 'src/database/schema';
import { RootRouteModule } from './routes/rootRoute.module';
import { DATABASE } from './constants';

@Module({
  // 依存モジュール
  imports: [
    DrizzlePGModule.register({
      tag: DATABASE,
      pg: {
        connection: 'pool',
        config: {
          connectionString: 'postgres://postgres:postgres@db:5432/frost',
          max: 10,
        },
      },
      config: {
        schema,
      },
    }),
    RootRouteModule
  ],
})
export class AppModule { }
