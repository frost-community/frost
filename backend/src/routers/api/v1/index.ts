import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';
import { AccountService } from '../../../services/AccountService';
import { UserService } from '../../../services/UserService';
import { RouteService } from '../../util/endpoint';
import { operations } from '../../../../generated/schema';

@injectable()
export class ApiVer1Router {
  constructor(
    @inject(TYPES.RouteService) private readonly routeService: RouteService,
    @inject(TYPES.AccountService) private readonly accountService: AccountService,
    @inject(TYPES.UserService) private readonly userService: UserService,
  ) {}

  create() {
    const router = express.Router();

    router.get('/echo', this.routeService.create(({ req }) => {
      return { message: req.query.message };
    }));

    router.post('/echo', this.routeService.create(({ req }) => {
      return { message: req.body.message };
    }));

    this.routeAccount(router);
    this.routeUser(router);

    return router;
  }

  private routeAccount(router: express.Router) {
    router.get('/account', this.routeService.create(async ({ req, res, db }) => {
      // permission: account.read
      const query = req.query as NonNullable<operations['GetAccount']['parameters']['query']>;
      return await this.accountService.get({ accountId: query.accountId, name: query.name }, db) as operations['GetAccount']['responses']['200']['content']['application/json'];
    }));

    router.delete('/account/me', this.routeService.createWithTransaction(async ({ req, res, db }) => {
      // permission account.delete
      const accountId = ''; // TODO: get accountId of authenticated user
      await this.accountService.delete({ accountId }, db);
      res.status(204).send();
    }));

    router.post('/account/signup', this.routeService.createWithTransaction(async ({ req, res, db }) => {
      // permission: account.auth
      const body = req.body as NonNullable<operations['Signup']['requestBody']['content']['application/json']>;
      return await this.accountService.signup({ name: body.name, password: body.password }, db) as operations['Signup']['responses']['200']['content']['application/json'];
    }));

    router.post('/account/signin', this.routeService.createWithTransaction(async ({ req, res, db }) => {
      // permission: account.auth
      const body = req.body as NonNullable<operations['Signin']['requestBody']['content']['application/json']>;
      return await this.accountService.signin({ name: body.name, password: body.password }, db) as operations['Signin']['responses']['200']['content']['application/json'];
    }));
  }

  private routeUser(router: express.Router) {
    router.post('/user', this.routeService.createWithTransaction(async ({ req, res, db }) => {
      // permission user.provider
      const accountId = ''; // TODO: get accountId of authenticated user
      const body = req.body as NonNullable<operations['CreateUser']['requestBody']['content']['application/json']>;
      return await this.userService.create({ accountId, name: body.name, displayName: body.displayName }, db) as operations['CreateUser']['responses']['200']['content']['application/json'];
    }));

    router.get('/user', this.routeService.create(async ({ req, res, db }) => {
      // permission user.read
      const query = req.query as NonNullable<operations['GetUser']['parameters']['query']>;
      return await this.userService.get({ userId: query.userId, name: query.name }, db) as operations['GetUser']['responses']['200']['content']['application/json'];
    }));

    router.delete('/user', this.routeService.createWithTransaction(async ({ req, res, db }) => {
      // permission user.provider
      const query = req.query as NonNullable<operations['DeleteUser']['parameters']['query']>;
      await this.userService.delete({ userId: query.userId }, db);
      res.status(204).send();
    }));
  }
}
