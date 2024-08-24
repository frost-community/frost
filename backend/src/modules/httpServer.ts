import express from "express";
import { Container } from "inversify";
import { AppConfig } from "../app";
import { TYPES } from "../container/types";
import { RootRouter } from "../routes";
import { buildRestApiError } from "./appErrors";
import * as auth from "./httpAuthentication";

export function createHttpServer(container: Container) {
  const config = container.get<AppConfig>(TYPES.AppConfig);
  const rootRouter = container.get<RootRouter>(TYPES.RootRouter);

  const app = express();
  app.disable("x-powered-by");

  auth.configureServer(container);

  app.use(express.json());

  app.use(rootRouter.create());

  // @ts-ignore
  app.use((err, req, res, next) => {
    const errorResponse = buildRestApiError(err);
    res.status(errorResponse.error.status).json(errorResponse);
    return;
  });

  return new Promise<void>(resolve => {
    app.listen(config.port, () => resolve());
  });
}
