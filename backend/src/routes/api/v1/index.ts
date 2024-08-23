import express from 'express';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';
import { UserService } from '../../../services/UserService';
import * as routeTypes from '../../../types/endpoints';
import { PostService } from '../../../services/PostService';
import { HttpRouteBuilder } from '../../../modules/HttpRouteBuilder';

@injectable()
export class ApiVer1Router {
  constructor(
    @inject(TYPES.Container) private readonly container: Container,
  ) {}

  create() {
    const router = express.Router();
    const routeBuilder = new HttpRouteBuilder(router, this.container);

    const userService = this.container.get<UserService>(TYPES.UserService);
    const postService = this.container.get<PostService>(TYPES.PostService);

    routeBuilder.build<{ message: string }, { message: string }>({
      method: 'GET',
      path: '/echo',
      async requestHandler(ctx) {
        return { message: ctx.params.message };
      },
    });

    routeBuilder.build<{ message: string }, { message: string }>({
      method: 'POST',
      path: '/echo',
      async requestHandler(ctx) {
        return { message: ctx.params.message };
      },
    });

    routeBuilder.build<routeTypes.SignupBody, routeTypes.SignupResponse>({
      method: 'POST',
      path: '/signup',
      scope: 'user.auth',
      async requestHandler(ctx) {
        const result = await userService.signup(ctx.params, { userId: ctx.auth!.userId, db: ctx.db });
        return result;
      },
    });

    routeBuilder.build<routeTypes.SigninBody, routeTypes.SigninResponse>({
      method: 'POST',
      path: '/signin',
      scope: 'user.auth',
      async requestHandler(ctx) {
        const result = await userService.signin(ctx.params, { userId: ctx.auth!.userId, db: ctx.db });
        return result;
      },
    });

    routeBuilder.build<routeTypes.GetUserQuery, routeTypes.GetUserResponse>({
      method: 'GET',
      path: '/user',
      scope: 'user.read',
      async requestHandler(ctx) {
        const result = await userService.get(ctx.params, { userId: ctx.auth!.userId, db: ctx.db });
        return result;
      },
    });

    routeBuilder.build<routeTypes.GetUserQuery, routeTypes.GetUserResponse>({
      method: 'DELETE',
      path: '/user',
      scope: 'user.delete',
      async requestHandler(ctx) {
        throw new Error('not implemented');
        // const accessUser = req.user as UserEntity;
        // const params = req.query as DeleteUserQuery;
        // await this.userService.delete(params, { accessUserId: accessUser.userId, db });
        // res.status(204).send();
      },
    });

    routeBuilder.build<routeTypes.CreateTimelinePostBody, routeTypes.CreateTimelinePostResponse>({
      method: 'POST',
      path: '/post',
      scope: 'post.write',
      async requestHandler(ctx) {
        const result = await postService.createTimelinePost(ctx.params, { userId: ctx.auth!.userId, db: ctx.db });
        return result;
      },
    });

    routeBuilder.build<routeTypes.GetPostQuery, routeTypes.GetPostResponse>({
      method: 'GET',
      path: '/post',
      scope: 'post.read',
      async requestHandler(ctx) {
        const result = await postService.get(ctx.params, { userId: ctx.auth!.userId, db: ctx.db });
        return result;
      },
    });

    routeBuilder.build<routeTypes.DeletePostQuery, void>({
      method: 'DELETE',
      path: '/post',
      scope: 'post.delete',
      async requestHandler(ctx) {
        await postService.delete(ctx.params, { userId: ctx.auth!.userId, db: ctx.db });
      },
    });

    return router;
  }
}
