import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';
import { UserService } from '../../../services/UserService';

@injectable()
export class UsersRoute {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService
  ) {}

  create() {
    const router = express.Router();

    router.post('/users', async (req, res, next) => {
      try {
        const accountId = '';
        const { name, displayName } = req.body;
        const model = await this.userService.create({ accountId, name, displayName });
        res.status(200).json(model);
      } catch(err) {
        // TODO: catch service error
        next(err);
      }
    });

    router.get('/users/:userId', async (req, res, next) => {
      try {
        const { userId } = req.params;
        const model = await this.userService.get({ userId });
        res.status(200).json(model);
      } catch(err) {
        // TODO: catch service error
        next(err);
      }
    });

    return router;
  }
}
