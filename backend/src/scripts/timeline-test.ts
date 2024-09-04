import { Container } from 'inversify';
import { BACKEND_URSR_ID } from '../constants/specialUserId';
import { setupContainer } from '../container/inversify.config';
import { TYPES } from '../container/types';
import { PrismaClient } from '@prisma/client';
import { AccessContext } from '../modules/AccessContext';
import { PostRepository } from '../repositories/PostRepository';
import { inspect } from 'util';
import { UserRepository } from '../repositories/UserRepository';

async function run() {
  // setup container
  const container = new Container();
  setupContainer(container);

  // get instance
  const db = container.get<PrismaClient>(TYPES.db);
  const userRepository = container.get<UserRepository>(TYPES.UserRepository);
  const postRepository = container.get<PostRepository>(TYPES.PostRepository);

  const ctx: AccessContext = { userId: BACKEND_URSR_ID, db };

  // debugユーザーを取得。無ければ作る。
  let user = await userRepository.get({ name: 'debug' }, ctx);
  if (user == null) {
    console.log('テストユーザーを作成');
    user = await userRepository.create({
      name: 'debug',
      displayName: 'Debug',
      passwordAuthEnabled: false,
    }, ctx);
  }
  ctx.userId = user.userId;

  let post, posts;

  // create post
  console.log('投稿の作成');
  for (let i = 0; i < 5; i++) {
    post = await postRepository.create({ userId: user.userId, content: 'test ' + Math.floor(Math.random() * 1000) }, ctx);
    console.log(inspect(post, { depth: 10 }));
  }

  // fetch posts
  console.log('タイムライン取得');
  posts = await postRepository.fetchTimeline({ kind: 'home', limit: 8 }, ctx);
  console.log(inspect(posts, { depth: 10 }));

  await db.$disconnect();
}
run()
  .catch(err => {
    console.error(err);
  });
