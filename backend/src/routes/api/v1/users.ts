import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';
import { UserService } from '../../../services/UserService';
import { api } from '../../../util/api';

@injectable()
export class UsersRoute {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService
  ) {}

  create() {
    const router = express.Router();

    router.post('/users', api(async (req, res) => {
      const accountId = '';
      const { name, displayName } = req.body;
      const model = await this.userService.create({ accountId, name, displayName });
      res.status(200).json(model);
    }));

    router.get('/users/:userId', api(async (req, res) => {
      const { userId } = req.params;
      const model = await this.userService.get({ userId });
      res.status(200).json(model);
    }));

    return router;
  }
}
