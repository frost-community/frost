import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';
import { AccountService } from '../../../services/AccountService';
import { endpoint } from '../../../util/endpoint';

@injectable()
export class AccountsRoute {
  constructor(
    @inject(TYPES.AccountService) private readonly accountService: AccountService
  ) {}

  create() {
    const router = express.Router();

    router.post('/accounts', endpoint(async (req, res) => {
      const { name, password } = req.body;
      const model = await this.accountService.create({ name, password });
      res.status(200).json(model);
    }));

    return router;
  }
}
