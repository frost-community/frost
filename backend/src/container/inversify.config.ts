import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';
import { App, AppConfig } from '../app';
import { TYPES } from './types';

// routers
import { RootRouter } from '../routes';
import { ApiVer1Router } from '../routes/apiVer1';

export function setupContainer(container: Container) {
  container.bind<Container>(TYPES.Container).toConstantValue(container);

  // app
  container.bind<App>(TYPES.App).to(App);

  // app config
  const appConfig: AppConfig = {
    port: 3000,
    env: 'development',
    db: {
      connectionString: 'postgresql://postgres:postgres@db:5432/frost',
      maxPool: 20,
    },
  };
  container.bind(TYPES.AppConfig).toConstantValue(appConfig);

  // modules
  container.bind<PrismaClient>(TYPES.db).toConstantValue(new PrismaClient());

  // routers
  container.bind<RootRouter>(TYPES.RootRouter).to(RootRouter);
  container.bind<ApiVer1Router>(TYPES.ApiVer1Router).to(ApiVer1Router);
}
