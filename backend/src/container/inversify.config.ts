import { Container } from 'inversify';
import { App, AppConfig } from '../app';
import { DatabaseService } from '../services/DatabaseService';
import { HttpServerService } from '../services/HttpServerService';
import { TYPES } from './types';
import { UserService } from '../services/UserService';
import { AccountService } from '../services/AccountService';
import { PasswordVerificationService } from '../services/PasswordVerificationService';
import { RootRoute } from '../routes';
import { AccountsRoute } from '../routes/api/v1/accounts';
import { UsersRoute } from '../routes/api/v1/users';
import { MeRoute } from '../routes/api/v1/me';
import { EchoRoute } from '../routes/api/v1/echo';

export function setupContainer(container: Container) {
  // app
  container.bind<App>(TYPES.App).to(App);

  // app config
  const appConfig: AppConfig = {
    port: 3000,
    env: 'development',
  };
  container.bind(TYPES.AppConfig).toConstantValue(appConfig);

  // services
  container.bind<AccountService>(TYPES.AccountService).to(AccountService);
  container.bind<DatabaseService>(TYPES.DatabaseService).toConstantValue(new DatabaseService());
  container.bind<HttpServerService>(TYPES.HttpServerService).to(HttpServerService);
  container.bind<UserService>(TYPES.UserService).to(UserService);
  container.bind<PasswordVerificationService>(TYPES.PasswordVerificationService).to(PasswordVerificationService);

  // routes
  container.bind<RootRoute>(TYPES.RootRoute).to(RootRoute);
  container.bind<AccountsRoute>(TYPES.AccountsRoute).to(AccountsRoute);
  container.bind<EchoRoute>(TYPES.EchoRoute).to(EchoRoute);
  container.bind<MeRoute>(TYPES.MeRoute).to(MeRoute);
  container.bind<UsersRoute>(TYPES.UsersRoute).to(UsersRoute);
}
