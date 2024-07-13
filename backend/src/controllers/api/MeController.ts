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

    // TODO: catch account not found

    return user;
  }
}
