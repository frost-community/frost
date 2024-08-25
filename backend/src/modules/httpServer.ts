import express from "express";
import { Container } from "inversify";
import { AppConfig } from "../app";
import { TYPES } from "../container/types";
import { RootRouter } from "../routes";
import { AppError, ErrorObject, ServerError } from "./appErrors";
import * as auth from "./httpAuthentication";

/**
 * 任意のエラー情報を元にREST APIのエラーを組み立てます。
*/
function buildRestApiError(err: unknown): { error: ErrorObject } {
  // app error
  if (err instanceof AppError) {
    return {
      error: err.error,
    };
  }

  // other errors
  console.error(err);
  return {
    error: new ServerError(),
  };
}

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
