import express from 'express';
import { Container, inject, injectable } from 'inversify';
import z from 'zod';
import { TYPES } from '../container/types';
import { appError, EndpointNotFound } from '../modules/appErrors';
import { corsApi } from '../modules/httpRoute/cors';
import { ApiRouteBuilder } from '../modules/httpRoute/ApiRouteBuilder';
import { PostService } from '../services/PostService';
import { UserService } from '../services/UserService';
import * as routeTypes from '../modules/httpRoute/endpoints';

@injectable()
export class ApiVer1Router {
  constructor(
    @inject(TYPES.Container) private readonly container: Container,
  ) {}

  public create() {
    const userService = this.container.get<UserService>(TYPES.UserService);
    const postService = this.container.get<PostService>(TYPES.PostService);

    const builder = new ApiRouteBuilder(this.container);

    builder.router.use(corsApi());

    builder.register({
      method: 'GET',
      path: '/echo',
      async requestHandler(ctx): Promise<{ message: string }> {
        const params: { message: string } = ctx.validateParams(
          z.object({
            message: z.string().min(1),
          })
        );
        return { message: params.message };
      },
    });

    builder.register({
      method: 'POST',
      path: '/echo',
      async requestHandler(ctx): Promise<{ message: string }> {
        const params: { message: string } = ctx.validateParams(
          z.object({
            message: z.string().min(1),
          })
        );
        return { message: params.message };
      },
    });

    builder.register({
      method: 'POST',
      path: '/signup',
      scope: 'user.auth',
      async requestHandler(ctx): Promise<routeTypes.SignupResult> {
        const params: routeTypes.SignupParams = ctx.validateParams(
          z.object({
            name: z.string().min(1),
            password: z.string().min(1).optional(),
            displayName: z.string().min(1),
          })
        );
        const result = await userService.signup(params, { userId: ctx.getUser().userId, db: ctx.db });
        return result;
      },
    });

    builder.register({
      method: 'POST',
      path: '/signin',
      scope: 'user.auth',
      async requestHandler(ctx): Promise<routeTypes.SigninResult> {
        const params: routeTypes.SigninParams = ctx.validateParams(
          z.object({
            name: z.string().min(1),
            password: z.string().min(1).optional(),
          })
        );
        const result = await userService.signin(params, { userId: ctx.getUser().userId, db: ctx.db });
        return result;
      },
    });

    builder.register({
      method: 'GET',
      path: '/user',
      scope: 'user.read',
      async requestHandler(ctx): Promise<routeTypes.GetUserResult> {
        const params: routeTypes.GetUserParams = ctx.validateParams(
          z.object({
            userId: z.string().length(32).optional(),
            name: z.string().min(1).optional(),
          })
        );
        const result = await userService.get(params, { userId: ctx.getUser().userId, db: ctx.db });
        return result;
      },
    });

    builder.register({
      method: 'DELETE',
      path: '/user',
      scope: 'user.delete',
      async requestHandler(ctx): Promise<routeTypes.GetUserResult> {
        throw new Error('not implemented');
        // const accessUser = req.user as UserEntity;
        // const params = req.query as DeleteUserQuery;
        // await this.userService.delete(params, { accessUserId: accessUser.userId, db });
        // res.status(204).send();
      },
    });

    builder.register({
      method: 'POST',
      path: '/post',
      scope: 'post.write',
      async requestHandler(ctx): Promise<routeTypes.CreateTimelinePostResult> {
        const params: routeTypes.CreateTimelinePostParams = ctx.validateParams(
          z.object({
            content: z.string().min(1),
          })
        );
        const result = await postService.createTimelinePost(params, { userId: ctx.getUser().userId, db: ctx.db });
        return result;
      },
    });

    builder.register({
      method: 'GET',
      path: '/post',
      scope: 'post.read',
      async requestHandler(ctx): Promise<routeTypes.GetPostResult> {
        const params: routeTypes.GetPostParams = ctx.validateParams(
          z.object({
            postId: z.string().length(32),
          })
        );
        const result = await postService.get(params, { userId: ctx.getUser().userId, db: ctx.db });
        return result;
      },
    });

    builder.register({
      method: 'DELETE',
      path: '/post',
      scope: 'post.delete',
      async requestHandler(ctx): Promise<void> {
        const params: routeTypes.DeletePostParams = ctx.validateParams(
          z.object({
            postId: z.string().length(32),
          })
        );
        await postService.delete(params, { userId: ctx.getUser().userId, db: ctx.db });
      },
    });

    builder.router.use((req, res, next) => {
      next(appError(new EndpointNotFound()));
    });

    return builder.router;
  }
}