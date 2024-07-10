import { Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, requestParam, response } from 'inversify-express-utils';
import { AccountService } from '../../services/AccountService';
import { DatabaseService } from '../../services/DatabaseService';
import { TYPES } from '../../types';

@controller('/api/me')
export class MeController {
  constructor(
    @inject(TYPES.DatabaseService) private readonly db: DatabaseService,
    @inject(TYPES.AccountService) private readonly accountService: AccountService,
  ) {}

  @httpGet('/')
  async get(@response() res: Response) {
    // TODO: get accountId of session user
    const accountId = '00000001-0000-0000-0000-000000000000';

    const user = await this.accountService.get(accountId, this.db);

    if (user == null) {
      res.status(404).json({ status: 404, message: 'not found' });
      return;
    }

    return user;
  }
}