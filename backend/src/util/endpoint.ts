import express from 'express';
import type { RouteParameters } from 'express-serve-static-core';

export function endpoint(
  handler: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void> | void
): express.RequestHandler {
  return (req, res, next) => {
    const returnValue = handler(req, res, next);
    if (returnValue == null) return;
    returnValue.catch(err => {
      // TODO: catch service error
      next(err);
    });
  };
}
