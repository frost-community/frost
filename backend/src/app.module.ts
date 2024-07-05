import { Module } from '@nestjs/common';
import { RootRouteModule } from './routes/rootRoute.module';
import { Pool } from 'pg';
import { PostgresDialect } from 'kysely';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  // 依存モジュール
  imports: [
    DatabaseModule.create({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: 'postgres://postgres:postgres@db:5432/frost',
          max: 10,
        })
      }),
    }),
    RootRouteModule
  ]
})
export class AppModule { }
