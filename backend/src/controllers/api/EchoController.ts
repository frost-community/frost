import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, requestParam, response } from 'inversify-express-utils';
import { AccountService } from '../../services/AccountService';
import { TYPES } from '../../container/types';

@controller('/api/v1/echo')
export class EchoController {
  constructor(
    @inject(TYPES.AccountService) private readonly accountService: AccountService,
  ) {}

  @httpGet('/')
  async echoGet(@request() req: Request, @response() res: Response) {
    return req.query;
  }

  @httpPost('/')
  async echoPost(@request() req: Request, @response() res: Response) {
    return req.body;
  }
}
