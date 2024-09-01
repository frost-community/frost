import { Container } from 'inversify';
import { BACKEND_URSR_ID } from '../constants/specialUserId';
import { setupContainer } from '../container/inversify.config';
import { TYPES } from '../container/types';
import { ConnectionPool } from '../modules/database';
import { TokenRepository } from '../repositories/TokenRepository';
import { AccessContext } from '../modules/AccessContext';

async function run() {
  const token = process.argv[2];
  if (token == null) {
    console.log("引数からトークンを指定してください");
    return;
  }

  // setup container
  const container = new Container();
  setupContainer(container);

  // get instance
  const connectionPool = container.get<ConnectionPool>(TYPES.ConnectionPool);
  const tokenRepository = container.get<TokenRepository>(TYPES.TokenRepository);
  const db = await connectionPool.acquire();

  const ctx: AccessContext = { userId: BACKEND_URSR_ID, db };

  const success = await tokenRepository.delete({
    token,
  }, ctx);
  if (success) {
    console.log(`トークン'${token}'を削除しました`);
  } else {
    console.log(`トークン'${token}'の削除に失敗しました`);
  }
  db.dispose();
  await connectionPool.dispose();
}
run()
  .catch(err => {
    console.error(err);
  });
