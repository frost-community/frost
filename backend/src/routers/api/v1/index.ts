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
      // accountId or name required
      const { accountId, name } = req.body;
      return this.accountService.get({ accountId, name });
    }));

    // permission account.delete
    router.delete('/account/me', endpoint(async (req, res) => {
      // TODO: get accountId of authenticated user
      const accountId = '';
      // const { } = req.body;
      await this.accountService.delete({ accountId });
      res.status(204).send();
    }));

    // permission: account.special
    router.post('/account/signup', endpoint(async (req, res) => {
      const { name, password } = req.body;
      // TODO: ここらへんサービス化する
      if (password == null) {
        throw createError({ code: 'authMethodRequired', message: 'Authentication method required.', status: 400 });
      }
      const account = await this.accountService.create({ name });
      await this.passwordVerificationService.register({ accountId: account.accountId, password });
      return { accessToken: 'TODO', account };
    }));

    // permission: account.special
    router.post('/account/signin', endpoint(async (req, res) => {
      const { name, password } = req.body;
      // TODO: ここらへんサービス化する
      const account = await this.accountService.get({ name });
      if (account.passwordAuthEnabled) {
        const verification = await this.passwordVerificationService.verifyPassword({ accountId: account.accountId, password });
        if (!verification) {
          throw createError({ code: 'signinFailure', message: 'Signin failure.', status: 401 });
        }
        // TODO: get access token
        return { accessToken: 'TODO', account };
      }
      throw new Error('authentication method not exists: ' + account.accountId);
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
