import express from 'express';
import { inject, injectable } from 'inversify';
import { AppConfig } from '../app';
import { TYPES } from '../container/types';
import { RootRouter } from '../routers';
import * as openapi from 'express-openapi-validator';
import * as errors from '../modules/service-error';

@injectable()
export class HttpServerService {
  constructor(
    @inject(TYPES.AppConfig) private readonly config: AppConfig,
    @inject(TYPES.RootRouter) private readonly rootRouter: RootRouter,
  ) {}

  listen(): Promise<void> {
    const app = express();
    app.use(express.json());

    app.use(openapi.middleware({
      apiSpec: '../spec/generated/openapi.yaml',
      validateRequests: true,
      validateResponses: (this.config.env == 'test'),
    }));

    app.use(this.rootRouter.create());

    app.use((req, res, next) => {
      next(errors.createError(new errors.EndpointNotFound()));
    });
    // @ts-ignore
    app.use((err, req, res, next) => {
      const errorResponse = errors.buildRestApiError(err);
      res.status(errorResponse.error.status).json(errorResponse);
      return;
    });

    return new Promise(resolve => {
      app.listen(this.config.port, () => resolve());
    });
  }
}
