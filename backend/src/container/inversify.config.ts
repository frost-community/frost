import { Container } from 'inversify';
import { App, AppConfig } from '../app';

import { RouteService } from '../routers/util/endpoint';
import { DatabaseService } from '../services/DatabaseService';
import { HttpServerService } from '../services/HttpServerService';
import { UserService } from '../services/UserService';
import { PasswordVerificationService } from '../services/PasswordVerificationService';
import { TokenService } from '../services/TokenService';
import { PostService } from '../services/PostService';
import { TYPES } from './types';
import { RootRouter } from '../routers';
import { ApiVer1Router } from '../routers/api/v1';

export function setupContainer(container: Container) {
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

  // services
  container.bind<RouteService>(TYPES.RouteService).to(RouteService);
  container.bind<DatabaseService>(TYPES.DatabaseService).toConstantValue(new DatabaseService(appConfig));
  container.bind<HttpServerService>(TYPES.HttpServerService).to(HttpServerService);
  container.bind<UserService>(TYPES.UserService).to(UserService);
  container.bind<PasswordVerificationService>(TYPES.PasswordVerificationService).to(PasswordVerificationService);
  container.bind<TokenService>(TYPES.TokenService).to(TokenService);
  container.bind<PostService>(TYPES.PostService).to(PostService);

  // routers
  container.bind<RootRouter>(TYPES.RootRouter).to(RootRouter);
  container.bind<ApiVer1Router>(TYPES.ApiVer1Router).to(ApiVer1Router);
}
