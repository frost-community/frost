import { Container } from 'inversify';
import { HttpServerService } from './services/HttpServerService';
import { TYPES } from './types';
import { App } from './app';
import { DatabaseService } from './services/DatabaseService';

export function createContainer() {
  const container = new Container();

  // root
  container.bind<App>(TYPES.App).to(App);

  // controllers

  // services
  container.bind<DatabaseService>(TYPES.DatabaseService).toConstantValue(new DatabaseService());
  container.bind<HttpServerService>(TYPES.HttpServerService).to(HttpServerService);

  return container;
}
