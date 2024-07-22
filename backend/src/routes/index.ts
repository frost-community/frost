import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types';

import { EchoRoute } from './api/v1/echo';
import { UsersRoute } from './api/v1/users';
import { MeRoute } from './api/v1/me';
import { AccountsRoute } from './api/v1/accounts';

@injectable()
export class RootRoute {
  constructor(
    @inject(TYPES.AccountsRoute) private readonly accountsRoute: AccountsRoute,
    @inject(TYPES.EchoRoute) private readonly echoRoute: EchoRoute,
    @inject(TYPES.MeRoute) private readonly meRoute: MeRoute,
    @inject(TYPES.UsersRoute) private readonly usersRoute: UsersRoute,
    
  ) {}

  create() {
    const router = express.Router();
    router.use('/api/v1', this.accountsRoute.create());
    router.use('/api/v1', this.echoRoute.create());
    router.use('/api/v1', this.meRoute.create());
    router.use('/api/v1', this.usersRoute.create());
    return router;
  }
}
