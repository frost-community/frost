import express from 'express';

/**
 * APIエンドポイント向けのリクエストハンドラを生成します。
*/
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
