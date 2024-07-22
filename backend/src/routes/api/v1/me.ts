import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';
import { AccountService } from '../../../services/AccountService';
import { endpoint } from '../../../util/endpoint';

@injectable()
export class MeRoute {
  constructor(
    @inject(TYPES.AccountService) private readonly accountService: AccountService
  ) {}

  create() {
    const router = express.Router();

    router.get('/me', endpoint(async (req, res) => {
      // TODO: get accountId of session user
      const accountId = '00000001-0000-0000-0000-000000000000';

      const model = await this.accountService.get({ accountId });
      res.status(200).json(model);
    }));

    return router;
  }
}
