import { Request, Response, NextFunction } from 'express';
import { controller, httpGet, requestParam, response } from 'inversify-express-utils';

@controller('/api/users')
export class UsersController {
  @httpGet('/:id')
  Get(@requestParam('id') id: string, @response() res: Response) {
    console.log(id);
    res.status(501).json({ status: 501, message: 'not implement' });
  }
}
