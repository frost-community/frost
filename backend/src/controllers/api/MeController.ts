import { Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, requestParam, response } from 'inversify-express-utils';
import { AccountService } from '../../services/AccountService';
import { TYPES } from '../../container/types';

@controller('/api/me')
export class MeController {
  constructor(
    @inject(TYPES.AccountService) private readonly accountService: AccountService,
  ) {}

  @httpGet('/')
  async get(@response() res: Response) {
    // TODO: get accountId of session user
    const accountId = '00000001-0000-0000-0000-000000000000';

    const user = await this.accountService.get(accountId);

    if (user == null) {
      res.status(404).json({ status: 404, message: 'not found' });
      return;
    }

    return user;
  }
}
