import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Kysely, KyselyConfig } from 'kysely';

@Global()
@Module({})
export class DatabaseModule {
  public static create<T>(config: KyselyConfig): DynamicModule {
    const providers: Provider[] = [
      {
        provide: Kysely<T>,
        useValue: new Kysely<T>(config),
      }
    ];

    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
