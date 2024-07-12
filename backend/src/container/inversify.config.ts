import { Container } from 'inversify';
import { App, AppConfig } from '../app';
import { DatabaseService } from '../services/DatabaseService';
import { HttpServerService } from '../services/HttpServerService';
import { TYPES } from './types';
import { UserService } from '../services/UserService';
import { AccountService } from '../services/AccountService';
import { PasswordAuthService } from '../services/PasswordAuthService';

export function setupContainer(container: Container) {
  // app
  container.bind<App>(TYPES.App).to(App);

  // app config
  const appConfig: AppConfig = {
    port: 3000,
  };
  container.bind(TYPES.AppConfig).toConstantValue(appConfig);

  // services
  container.bind<AccountService>(TYPES.AccountService).to(AccountService);
  container.bind<DatabaseService>(TYPES.DatabaseService).toConstantValue(new DatabaseService());
  container.bind<HttpServerService>(TYPES.HttpServerService).to(HttpServerService);
  container.bind<UserService>(TYPES.UserService).to(UserService);
  container.bind<PasswordAuthService>(TYPES.PasswordAuthService).to(PasswordAuthService);
}
