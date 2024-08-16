import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';
import { UserService } from '../../../services/UserService';
import { RouteService } from '../../util/endpoint';
import { GetUserQuery, GetUserResponse, SigninBody, SigninResponse, SignupBody, SignupResponse } from '../../../modules/endpoint-types';

@injectable()
export class ApiVer1Router {
  constructor(
    @inject(TYPES.RouteService) private readonly routeService: RouteService,
    @inject(TYPES.UserService) private readonly userService: UserService,
  ) {}

  create() {
    const router = express.Router();

    router.get('/echo', this.routeService.create(({ req }) => {
      return { message: req.query.message };
    }));

    router.post('/echo', this.routeService.create(({ req }) => {
      return { message: req.body.message };
    }));

    this.routeUser(router);

    return router;
  }

  private routeUser(router: express.Router) {
    router.post('/signup', this.routeService.createWithTransaction(async ({ req, res, db }) => {
      // permission: user.auth
      const body = req.body as SignupBody;
      return await this.userService.signup({
        name: body.name,
        password: body.password,
        displayName: body.displayName
      }, db) as SignupResponse;
    }));

    router.post('/signin', this.routeService.createWithTransaction(async ({ req, res, db }) => {
      // permission: user.auth
      const body = req.body as SigninBody;
      return await this.userService.signin({
        name: body.name,
        password: body.password
      }, db) as SigninResponse;
    }));

    router.get('/user', this.routeService.create(async ({ req, res, db }) => {
      // permission user.read
      const query = req.query as GetUserQuery;
      return await this.userService.get({ userId: query.userId, name: query.name }, db) as GetUserResponse;
    }));

    router.delete('/user', this.routeService.createWithTransaction(async ({ req, res, db }) => {
      // permission user.delete
      throw new Error('not implemented');
      //const query = req.query as NonNullable<operations['DeleteUser']['parameters']['query']>;
      //await this.userService.delete({ userId: query.userId }, db);
      //res.status(204).send();
    }));
  }
}
