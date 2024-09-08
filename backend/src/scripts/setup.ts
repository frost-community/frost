import { PrismaClient } from '@prisma/client';
import { Container } from 'inversify';
import { BACKEND_URSR_ID } from '../constants/specialUserId';
import { setupContainer } from '../container/inversify.config';
import { TYPES } from '../container/types';
import { AccessContext } from '../modules/AccessContext';
import * as UserRepository from '../repositories/UserRepository';
import * as TokenService from '../services/TokenService';

async function run() {
  // setup container
  const container = new Container();
  setupContainer(container);

  // get instance
  const db = container.get<PrismaClient>(TYPES.db);

  const ctx: AccessContext = { userId: BACKEND_URSR_ID };

  const user = await UserRepository.create({
    name: 'Public',
    displayName: 'Public',
    passwordAuthEnabled: false,
  }, ctx, container);
  console.log("ユーザー'Public'を作成しました");
  console.log(user);

  const scopes = ["user.auth"];
  const accessToken = await TokenService.create({
    userId: user.userId,
    tokenKind: "access_token",
    scopes: scopes,
  }, ctx, container);
  console.log("ユーザー'Public'のアクセストークンを作成しました");
  console.log(accessToken);

  await db.$disconnect();
}
run()
  .catch(err => {
    console.error(err);
  });
