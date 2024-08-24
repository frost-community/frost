import { Container } from 'inversify';
import { BACKEND_URSR_ID } from '../constants/specialUserId';
import { setupContainer } from '../container/inversify.config';
import { TYPES } from '../container/types';
import { ConnectionPool } from '../modules/database';
import { UserRepository } from '../repositories/UserRepository';
import { TokenService } from '../services/TokenService';
import { AccessContext } from '../types/access-context';

async function run() {
  // setup container
  const container = new Container();
  setupContainer(container);

  // get instance
  const connectionPool = container.get<ConnectionPool>(TYPES.ConnectionPool);
  const userRepository = container.get<UserRepository>(TYPES.UserRepository);
  const tokenService = container.get<TokenService>(TYPES.TokenService);
  const db = await connectionPool.acquire();

  const ctx: AccessContext = { userId: BACKEND_URSR_ID, db };

  const user = await userRepository.create({
    name: 'Public',
    displayName: 'Public',
    passwordAuthEnabled: false,
  }, ctx);
  console.log("ユーザー'Public'を作成しました");
  console.log(user);

  const scopes = ["user.auth"];
  const accessToken = await tokenService.create({
    userId: user.userId,
    tokenKind: "access_token",
    scopes: scopes,
  }, ctx);
  console.log("ユーザー'Public'のアクセストークンを作成しました");
  console.log(accessToken);

  db.dispose();
  await connectionPool.dispose();
}
run()
  .catch(err => {
    console.error(err);
  });
