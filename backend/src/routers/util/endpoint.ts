import express from 'express';
import { isPromise } from '../../modules/promise-util';

/**
 * APIエンドポイント向けのリクエストハンドラを生成します。
*/
export function endpoint(
  handler: (req: express.Request, res: express.Response) => Promise<unknown> | unknown
): express.RequestHandler {
  return (req, res, next) => {
    const returnValue = handler(req, res);

    if (isPromise(returnValue)) {
      returnValue
        .then(value => {
          console.log(res.statusCode); // trace
          res.status(200).json(value);
        })
        .catch(err => {
          next(err);
        });
      return;
    }

    res.status(200).json(returnValue);
  };
}
