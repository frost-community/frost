import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';
import { AccountService } from '../../../services/AccountService';
import { UserService } from '../../../services/UserService';
import { endpoint } from '../../util/endpoint';
import { PasswordVerificationService } from '../../../services/PasswordVerificationService';
import { createError } from '../../../modules/service-error';

@injectable()
export class ApiVer1Router {
  constructor(
    @inject(TYPES.AccountService) private readonly accountService: AccountService,
    @inject(TYPES.PasswordVerificationService) private readonly passwordVerificationService: PasswordVerificationService,
    @inject(TYPES.UserService) private readonly userService: UserService,
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
    // permission: account.read
    router.get('/account', endpoint((req, res) => {
      const { accountId, name } = req.body as { accountId?: string, name?: string };
      return this.accountService.get({ accountId, name });
    }));

    // permission account.delete
    router.delete('/account/me', endpoint(async (req, res) => {
      const accountId = ''; // TODO: get accountId of authenticated user
      await this.accountService.delete({ accountId });
      res.status(204).send();
    }));

    // permission: account.special
    router.post('/account/signup', endpoint((req, res) => {
      const { name, password } = req.body as { name: string, password?: string };
      return this.accountService.signup({ name, password });
    }));

    // permission: account.special
    router.post('/account/signin', endpoint((req, res) => {
      const { name, password } = req.body as { name: string, password?: string };
      return this.accountService.signin({ name, password });
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
