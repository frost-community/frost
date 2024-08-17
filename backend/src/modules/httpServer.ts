import express from "express";
import { Container } from "inversify";
import { AppConfig } from "../app";
import { TYPES } from "../container/types";
import { RootRouter } from "../routes";
import * as openapi from "express-openapi-validator";
import { buildRestApiError } from "./apiErrors";
import { configureServer } from "./httpAuthentication";

export function createHttpServer(container: Container) {
  const config = container.get<AppConfig>(TYPES.AppConfig);
  const rootRouter = container.get<RootRouter>(TYPES.RootRouter);

  const app = express();
  configureServer(container);

  app.use(express.json());

  app.use(openapi.middleware({
    apiSpec: "./generated/openapi.yaml",
    validateRequests: true,
    validateResponses: (config.env == "test"),
  }));

  app.use(rootRouter.create());

  app.use((req, res, next) => {
    next(new Error("endpoint not implemented"));
  });

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

