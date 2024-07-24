import express from 'express';
import { inject, injectable } from 'inversify';
import { AppConfig } from '../app';
import { TYPES } from '../container/types';
import { RootRouter } from '../routers';
import * as OpenApiValidator from 'express-openapi-validator';

@injectable()
export class HttpServerService {
  constructor(
    @inject(TYPES.AppConfig) private readonly config: AppConfig,
    @inject(TYPES.RootRouter) private readonly rootRouter: RootRouter,
  ) {}

  listen(): Promise<void> {
    const app = express();
    app.use(express.json());

    app.use(OpenApiValidator.middleware({
      apiSpec: '../spec/generated/openapi.yaml',
      validateRequests: true,
      validateResponses: true,
    }));

    app.use(this.rootRouter.create());

    app.use((req, res) => {
      res.status(404).json({ status: 404, error: { message: 'Not found' } });
    });
    // @ts-ignore
    app.use((err, req, res, next) => {
      if (err.expose == null || err.expose) {
        if (err.status >= 400 && err.status < 500) {
          res.status(err.status).json(err);
          return;
        }
      }
      console.error(err);
      const status = err.status || 500;
      res.status(status).json({ status: status, error: { message: 'Internal server error' } });
    });

    return new Promise(resolve => {
      app.listen(this.config.port, () => resolve());
    });
  }
}
