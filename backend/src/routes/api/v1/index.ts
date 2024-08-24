import express from 'express';
import { Container, inject, injectable } from 'inversify';
import z from 'zod';
import { TYPES } from '../../../container/types';
import { HttpRouteBuilder } from '../../../modules/HttpRouteBuilder';
import { PostService } from '../../../services/PostService';
import { UserService } from '../../../services/UserService';
import * as routeTypes from '../../../types/endpoints';

@injectable()
export class ApiVer1Router {
  constructor(
    @inject(TYPES.Container) private readonly container: Container,
  ) {}

  create() {
    const router = express.Router();

    // CORS
    router.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST,GET,DELETE');
      if (req.method == 'OPTIONS') {
        return res.send(200);
      }
      next();
    });

    const routeBuilder = new HttpRouteBuilder(router, this.container);

    const userService = this.container.get<UserService>(TYPES.UserService);
    const postService = this.container.get<PostService>(TYPES.PostService);

    routeBuilder.build({
      method: 'GET',
      path: '/echo',
      async requestHandler(ctx): Promise<{ message: string }> {
        const params: { message: string } = ctx.validateParams(
          z.object({
            message: z.string(),
          })
        );
        return { message: params.message };
      },
    });

    routeBuilder.build({
      method: 'POST',
      path: '/echo',
      async requestHandler(ctx): Promise<{ message: string }> {
        const params: { message: string } = ctx.validateParams(
          z.object({
            message: z.string(),
          })
        );
        return { message: params.message };
      },
    });

    routeBuilder.build({
      method: 'POST',
      path: '/signup',
      scope: 'user.auth',
      async requestHandler(ctx): Promise<routeTypes.SignupResponse> {
        const params: routeTypes.SignupBody = ctx.validateParams(
          z.object({
            name: z.string(),
            password: z.string().optional(),
            displayName: z.string(),
          })
        );
        const result = await userService.signup(params, { userId: ctx.getUser().userId, db: ctx.db });
        return result;
      },
    });

    routeBuilder.build({
      method: 'POST',
      path: '/signin',
      scope: 'user.auth',
      async requestHandler(ctx): Promise<routeTypes.SigninResponse> {
        const params: routeTypes.SigninBody = ctx.validateParams(
          z.object({
            name: z.string(),
            password: z.string().optional(),
          })
        );
        const result = await userService.signin(params, { userId: ctx.getUser().userId, db: ctx.db });
        return result;
      },
    });

    routeBuilder.build({
      method: 'GET',
      path: '/user',
      scope: 'user.read',
      async requestHandler(ctx): Promise<routeTypes.GetUserResponse> {
        const params: routeTypes.GetUserQuery = ctx.validateParams(
          z.object({
            userId: z.string().optional(),
              name: z.string().optional(),
          })
        );
        const result = await userService.get(params, { userId: ctx.getUser().userId, db: ctx.db });
        return result;
      },
    });

    routeBuilder.build({
      method: 'DELETE',
      path: '/user',
      scope: 'user.delete',
      async requestHandler(ctx): Promise<routeTypes.GetUserResponse> {
        throw new Error('not implemented');
        // const accessUser = req.user as UserEntity;
        // const params = req.query as DeleteUserQuery;
        // await this.userService.delete(params, { accessUserId: accessUser.userId, db });
        // res.status(204).send();
      },
    });

    routeBuilder.build({
      method: 'POST',
      path: '/post',
      scope: 'post.write',
      async requestHandler(ctx): Promise<routeTypes.CreateTimelinePostResponse> {
        const params: routeTypes.CreateTimelinePostBody = ctx.validateParams(
          z.object({
            content: z.string(),
          })
        );
        const result = await postService.createTimelinePost(params, { userId: ctx.getUser().userId, db: ctx.db });
        return result;
      },
    });

    routeBuilder.build({
      method: 'GET',
      path: '/post',
      scope: 'post.read',
      async requestHandler(ctx): Promise<routeTypes.GetPostResponse> {
        const params: routeTypes.GetPostQuery = ctx.validateParams(
          z.object({
            postId: z.string(),
          })
        );
        const result = await postService.get(params, { userId: ctx.getUser().userId, db: ctx.db });
        return result;
      },
    });

    routeBuilder.build({
      method: 'DELETE',
      path: '/post',
      scope: 'post.delete',
      async requestHandler(ctx): Promise<void> {
        const params: routeTypes.DeletePostQuery = ctx.validateParams(
          z.object({
            postId: z.string(),
          })
        );
        await postService.delete(params, { userId: ctx.getUser().userId, db: ctx.db });
      },
    });

    return router;
  }
}
