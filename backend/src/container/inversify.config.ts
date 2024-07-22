import { Container } from 'inversify';
import { App, AppConfig } from '../app';
import { env } from '../environment/variables';
import { RootRouter } from '../routers';
import { ApiVer1Router } from '../routers/api/v1';
import { AccountService } from '../services/AccountService';
import { DatabaseService } from '../services/DatabaseService';
import { HttpServerService } from '../services/HttpServerService';
import { PasswordVerificationService } from '../services/PasswordVerificationService';
import { UserService } from '../services/UserService';
import { TYPES } from './types';

export function setupContainer(container: Container) {
  // app
  container.bind<App>(TYPES.App).to(App);

  // app config
  const appConfig: AppConfig = {
    port: env.PORT,
    env: env.ENV,
  };
  container.bind(TYPES.AppConfig).toConstantValue(appConfig);

  // services
  container.bind<AccountService>(TYPES.AccountService).to(AccountService);
  container.bind<DatabaseService>(TYPES.DatabaseService).toConstantValue(new DatabaseService());
  container.bind<HttpServerService>(TYPES.HttpServerService).to(HttpServerService);
  container.bind<UserService>(TYPES.UserService).to(UserService);
  container.bind<PasswordVerificationService>(TYPES.PasswordVerificationService).to(PasswordVerificationService);

  // routers
  container.bind<RootRouter>(TYPES.RootRouter).to(RootRouter);
  container.bind<ApiVer1Router>(TYPES.ApiVer1Router).to(ApiVer1Router);
}
