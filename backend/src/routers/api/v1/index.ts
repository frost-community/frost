import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';
import { AccountService } from '../../../services/AccountService';
import { UserService } from '../../../services/UserService';
import { endpoint } from '../../util/endpoint';
import { PasswordVerificationService } from '../../../services/PasswordVerificationService';
import { operations } from '../../../../generated/schema';

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
    router.get('/account', endpoint(async (req, res) => {
      // permission: account.read
      const query = req.query as NonNullable<operations['GetAccount']['parameters']['query']>;
      return await this.accountService.get({ accountId: query.accountId, name: query.name }) as operations['GetAccount']['responses']['200']['content']['application/json'];
    }));

    router.delete('/account/me', endpoint(async (req, res) => {
      // permission account.delete
      const accountId = ''; // TODO: get accountId of authenticated user
      await this.accountService.delete({ accountId });
      res.status(204).send();
    }));

    router.post('/account/signup', endpoint(async (req, res) => {
      // permission: account.auth
      const body = req.body as NonNullable<operations['Signup']['requestBody']['content']['application/json']>;
      return await this.accountService.signup({ name: body.name, password: body.password }) as operations['Signup']['responses']['200']['content']['application/json'];
    }));

    router.post('/account/signin', endpoint(async (req, res) => {
      // permission: account.auth
      const body = req.body as NonNullable<operations['Signin']['requestBody']['content']['application/json']>;
      return await this.accountService.signin({ name: body.name, password: body.password }) as operations['Signin']['responses']['200']['content']['application/json'];
    }));
  }

  private routeUser(router: express.Router) {
    router.post('/user', endpoint(async (req, res) => {
      // permission user.provider
      const accountId = ''; // TODO: get accountId of authenticated user
      const body = req.body as NonNullable<operations['CreateUser']['requestBody']['content']['application/json']>;
      return await this.userService.create({ accountId, name: body.name, displayName: body.displayName }) as operations['CreateUser']['responses']['200']['content']['application/json'];
    }));

    router.get('/user', endpoint(async (req, res) => {
      // permission user.read
      const query = req.query as NonNullable<operations['GetUser']['parameters']['query']>;
      return await this.userService.get({ userId: query.userId, name: query.name }) as operations['GetUser']['responses']['200']['content']['application/json'];
    }));

    router.delete('/user', endpoint(async (req, res) => {
      // permission user.provider
      const query = req.query as NonNullable<operations['DeleteUser']['parameters']['query']>;
      await this.userService.delete({ userId: query.userId });
      res.status(204).send();
    }));
  }
}
