import { Container } from 'inversify';
import { BACKEND_URSR_ID } from '../../constants/specialUserId';
import { setupContainer } from '../../container/inversify.config';
import { TYPES } from '../../container/types';
import { AccessContext } from '../../modules/AccessContext';
import { PrismaClient } from '@prisma/client';
import { inspect } from 'util';
import * as PasswordVerificationRepository from '../../repositories/PasswordVerificationRepository';
import * as UserRepository from '../../repositories/UserRepository';
import { generateHash, generateSalt } from '../../services/PasswordVerificationService';

async function run() {
  const container = new Container();
  setupContainer(container);

  const ctx: AccessContext = { userId: BACKEND_URSR_ID };

  // debugユーザーを取得。無ければ作る。
  console.log('get debug user');
  let user = await UserRepository.get({ userName: 'debug' }, ctx, container);
  if (user == null) {
    console.log('create debug user');
    user = await UserRepository.create({
      userName: 'debug',
      displayName: 'Debug',
      passwordAuthEnabled: false,
    }, ctx, container);
  }
  ctx.userId = user.userId;

  console.log('create');
  const algorithm = 'sha256';
  const salt = generateSalt();
  const iteration = 100000;
  const hash = generateHash({
    token: 'abcdefg',
    algorithm,
    salt,
    iteration,
  });
  const createResult = await PasswordVerificationRepository.create({
    userId: ctx.userId,
    algorithm: algorithm,
    salt: salt,
    iteration: iteration,
    hash: hash,
  }, ctx, container);
  console.log(inspect(createResult, { depth: 10 }));

  console.log('get');
  const getResult = await PasswordVerificationRepository.get({
    userId: ctx.userId,
  }, ctx, container);
  console.log(inspect(getResult, { depth: 10 }));

  console.log('remove');
  const removeResult = await PasswordVerificationRepository.remove({
    userId: ctx.userId,
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
