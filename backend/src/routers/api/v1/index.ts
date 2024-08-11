import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';
import { AccountService } from '../../../services/AccountService';
import { UserService } from '../../../services/UserService';
import { endpoint } from '../../util/endpoint';

@injectable()
export class ApiVer1Router {
  constructor(
    @inject(TYPES.AccountService) private readonly accountService: AccountService,
    @inject(TYPES.UserService) private readonly userService: UserService
  ) {}

  create() {
    const router = express.Router();

    router.get('/echo', endpoint((req, res) => {
      return { message: req.query.message };
    }));

    router.post('/echo', endpoint((req, res) => {
      return { message: req.body.message };
    }));

    this.routeAccount(router);
    this.routeUser(router);

    return router;
  }

  private routeAccount(router: express.Router) {
    // permission account.provider
    router.post('/account', endpoint((req, res) => {
      const { name, password } = req.body;
      return this.accountService.create({ name, password });
    }));

    // permission account.read
    router.get('/account/me', endpoint((req, res) => {
      // TODO: get accountId of authenticated user
      const accountId = '';

      return this.accountService.get({ accountId });
    }));

    // permission account.provider
    router.delete('/account/me', endpoint(async (req, res) => {
      // TODO: get accountId of authenticated user
      const accountId = '';

      await this.accountService.delete({ accountId });
      res.status(204).send();
    }));
  }

  private routeUser(router: express.Router) {
    // permission user.provider
    router.post('/user', endpoint((req, res) => {
      // TODO: get accountId of authenticated user
      const accountId = '';
      const { name, displayName } = req.body;

      return this.userService.create({ accountId, name, displayName });
    }));

    // permission user.read
    router.get('/user', endpoint((req, res) => {
      const userId = req.query.userId as string | undefined;
      const name = req.query.name as string | undefined;

      return this.userService.get({ userId, name });
    }));

    // permission user.provider
    router.delete('/user', endpoint(async (req, res) => {
      const userId = req.query.userId as string;

      await this.userService.delete({ userId });
      res.status(204).send();
    }));
  }
}
