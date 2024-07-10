import { Container } from 'inversify';
import { App, AppConfig } from './app';
import { DatabaseService } from './services/DatabaseService';
import { HttpServerService } from './services/HttpServerService';
import { TYPES } from './types';

export function setupContainer(container: Container) {
  // app
  container.bind<App>(TYPES.App).to(App);

  // app config
  const appConfig: AppConfig = {
    port: 3000,
  };
  container.bind(TYPES.AppConfig).toConstantValue(appConfig);

  // services
  container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService);
  container.bind<HttpServerService>(TYPES.HttpServerService).to(HttpServerService);
}
