import express from 'express';
import { isPromise } from '../../modules/promise-util';

/**
 * APIエンドポイント向けのリクエストハンドラを生成します。
 * 
 * 渡されたAPIハンドラによってレスポンスが生成されない場合(ステータスコードが0かどうかで判定されます)、
 * レスポンスはこのリクエストハンドラによって生成されます。
 * 
 * APIハンドラの実行中にエラーが発生した場合、throw文でエラーが投げられます。
 * そのエラーはHttpServerServiceで定義されるエラーハンドラでキャッチされ、エラーレスポンスが生成されます。
*/
export function endpoint(
  handler: (req: express.Request, res: express.Response) => Promise<unknown> | unknown
): express.RequestHandler {
  return (req, res, next) => {
    res.statusCode = 0;
    const returnValue = handler(req, res);
    if (isPromise(returnValue)) {
      returnValue
        .then(value => {
          if (res.statusCode == 0) {
            res.status(200).json(value);
          }
        })
        .catch(err => {
          next(err);
        });
      return;
    }
    if (res.statusCode == 0) {
      res.status(200).json(returnValue);
    }
  };
}
