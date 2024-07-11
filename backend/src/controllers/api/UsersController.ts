import { Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, requestParam, response } from 'inversify-express-utils';
import { UserService } from '../../services/UserService';
import { TYPES } from '../../container/types';

@controller('/api/users')
export class UsersController {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService,
  ) {}

  @httpGet('/:id')
  async get(@requestParam('id') id: string, @response() res: Response) {
    const user = await this.userService.get(id);

    if (user == null) {
      res.status(404).json({ status: 404, message: 'not found' });
      return;
    }

    return user;
  }
}
