import { Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, requestParam, response } from 'inversify-express-utils';
import { DatabaseService } from '../../services/DatabaseService';
import { UserService } from '../../services/UserService';
import { TYPES } from '../../container/types';

@controller('/api/users')
export class UsersController {
  constructor(
    @inject(TYPES.DatabaseService) private readonly db: DatabaseService,
    @inject(TYPES.UserService) private readonly userService: UserService,
  ) {}

  @httpGet('/:id')
  async get(@requestParam('id') id: string, @response() res: Response) {
    const user = await this.userService.get(id, this.db);

    if (user == null) {
      res.status(404).json({ status: 404, message: 'not found' });
      return;
    }

    return user;
  }
}
