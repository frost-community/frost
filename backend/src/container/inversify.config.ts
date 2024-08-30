import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';
import { App, AppConfig } from '../app';
import { TYPES } from './types';

// repositories
import { PasswordVerificationRepository } from '../repositories/PasswordVerificationRepository';
import { PostRepository } from '../repositories/PostRepository';
import { TokenRepository } from '../repositories/TokenRepository';
import { UserRepository } from '../repositories/UserRepository';

// services
import { PasswordVerificationService } from '../services/PasswordVerificationService';
import { PostService } from '../services/PostService';
import { TokenService } from '../services/TokenService';
import { UserService } from '../services/UserService';

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

  // repositories
  container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
  container.bind<PasswordVerificationRepository>(TYPES.PasswordVerificationRepository).to(PasswordVerificationRepository);
  container.bind<TokenRepository>(TYPES.TokenRepository).to(TokenRepository);
  container.bind<PostRepository>(TYPES.PostRepository).to(PostRepository);

  // services
  container.bind<UserService>(TYPES.UserService).to(UserService);
  container.bind<PasswordVerificationService>(TYPES.PasswordVerificationService).to(PasswordVerificationService);
  container.bind<TokenService>(TYPES.TokenService).to(TokenService);
  container.bind<PostService>(TYPES.PostService).to(PostService);

  // routers
  container.bind<RootRouter>(TYPES.RootRouter).to(RootRouter);
  container.bind<ApiVer1Router>(TYPES.ApiVer1Router).to(ApiVer1Router);
}
