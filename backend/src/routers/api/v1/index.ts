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

    router.post('/accounts', endpoint((req, res) => {
      const { name, password } = req.body;
      return this.accountService.create({ name, password });
    }));

    router.get('/echo', endpoint((req, res) => {
      return { message: req.query.message };
    }));

    router.post('/echo', endpoint((req, res) => {
      return { message: req.body.message };
    }));

    router.get('/me', endpoint((req, res) => {
      // TODO: get accountId of session user
      const accountId = '00000001-0000-0000-0000-000000000000';

      return this.accountService.get({ accountId });
    }));

    router.post('/users', endpoint((req, res) => {
      const accountId = '';
      const { name, displayName } = req.body;
      return this.userService.create({ accountId, name, displayName });
    }));

    router.get('/users/:userId', endpoint((req, res) => {
      const { userId } = req.params;
      return this.userService.get({ userId });
    }));

    return router;
  }
}
