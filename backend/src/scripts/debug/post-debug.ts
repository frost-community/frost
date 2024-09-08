import { Container } from 'inversify';
import { BACKEND_URSR_ID } from '../../constants/specialUserId';
import { setupContainer } from '../../container/inversify.config';
import { TYPES } from '../../container/types';
import { AccessContext } from '../../modules/AccessContext';
import { PrismaClient } from '@prisma/client';
import { inspect } from 'util';
import * as UserRepository from '../../repositories/UserRepository';
import * as PostRepository from '../../repositories/PostRepository';

async function run() {
  const container = new Container();
  setupContainer(container);

  const ctx: AccessContext = { userId: BACKEND_URSR_ID };

  // debugユーザーを取得。無ければ作る。
  console.log('get debug user');
  let user = await UserRepository.get({ name: 'debug' }, ctx, container);
  if (user == null) {
    console.log('create debug user');
    user = await UserRepository.create({
      name: 'debug',
      displayName: 'Debug',
      passwordAuthEnabled: false,
    }, ctx, container);
  }
  ctx.userId = user.userId;

  console.log('create');
  const createResult = await PostRepository.create({
    userId: ctx.userId,
    content: 'This is a post content.',
  }, ctx, container);
  console.log(inspect(createResult, { depth: 10 }));

  console.log('get');
  const getResult = await PostRepository.get({
    postId: createResult.postId,
  }, ctx, container);
  console.log(inspect(getResult, { depth: 10 }));

  console.log('remove');
  const removeResult = await PostRepository.remove({
    postId: createResult.postId,
  }, ctx, container);
  console.log(inspect(removeResult, { depth: 10 }));

  console.log('finish');

  const db = container.get<PrismaClient>(TYPES.db);
  await db.$disconnect();
}
run()
  .catch(err => {
    console.error(err);
  });
