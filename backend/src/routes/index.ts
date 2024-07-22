import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types';

import { EchoRoute } from './api/v1/echo';
import { UsersRoute } from './api/v1/users';

@injectable()
export class RootRoute {
  constructor(
    @inject(TYPES.EchoRoute) private readonly echoRoute: EchoRoute,
    @inject(TYPES.UsersRoute) private readonly usersRoute: UsersRoute,
  ) {}

  create() {
    const router = express.Router();
    router.use('/api/v1', this.echoRoute.create());
    router.use('/api/v1', this.usersRoute.create());
    return router;
  }
}
