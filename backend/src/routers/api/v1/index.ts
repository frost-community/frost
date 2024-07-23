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

    router.post('/accounts', endpoint(async (req, res) => {
      const { name, password } = req.body;
      const model = await this.accountService.create({ name, password });
      res.status(200).json(model);
    }));

    router.get('/echo', endpoint((req, res) => {
      res.status(200).json(req.query);
    }));

    router.post('/echo', endpoint((req, res) => {
      res.status(200).json(req.body);
    }));

    router.get('/me', endpoint(async (req, res) => {
      // TODO: get accountId of session user
      const accountId = '00000001-0000-0000-0000-000000000000';

      const model = await this.accountService.get({ accountId });
      res.status(200).json(model);
    }));

    router.post('/users', endpoint(async (req, res) => {
      const accountId = '';
      const { name, displayName } = req.body;
      const model = await this.userService.create({ accountId, name, displayName });
      res.status(200).json(model);
    }));

    router.get('/users/:userId', endpoint(async (req, res) => {
      const { userId } = req.params;
      const model = await this.userService.get({ userId });
      res.status(200).json(model);
    }));

    return router;
  }
}
