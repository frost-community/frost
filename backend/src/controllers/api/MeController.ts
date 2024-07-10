import { Request, Response, NextFunction } from 'express';
import { controller, httpGet, requestParam, response } from 'inversify-express-utils';

@controller('/api/me')
export class MeController {
  @httpGet('/')
  Get(@response() res: Response) {
    res.status(501).json({ status: 501, message: 'not implement' });
  }
}
