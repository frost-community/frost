import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../container/types';
import { Database, DatabaseService } from '../../services/DatabaseService';

@injectable()
export class RouteService {
  constructor(
    @inject(TYPES.DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  /**
   * APIエンドポイント向けのリクエストハンドラを生成します。
   * トランザクションを張り、エラーが発生した場合は変更内容をロールバックします。
   * 
   * 渡されたAPIハンドラによってレスポンスが生成されない場合(ステータスコードが0かどうかで判定されます)、
   * レスポンスはこのリクエストハンドラによって生成されます。
   * 
   * APIハンドラの実行中にエラーが発生した場合、throw文でエラーが投げられます。
   * そのエラーはHttpServerServiceで定義されるエラーハンドラでキャッチされ、エラーレスポンスが生成されます。
  */
  createWithTransaction(
    handler: (ctx: { req: express.Request, res: express.Response, db: Database }) => Promise<unknown> | unknown
  ): express.RequestHandler {
    return (req, res, next) => {
      const asyncHandler = async () => {
        res.statusCode = 0;
        // DBのコネクションプールからコネクションを取得
        const db = await this.databaseService.acquire();
        // トランザクションを開始
        const returnValue = await db.transaction(async (tx) => {
          try {
            return await handler({ req, res, db });
          } catch (err) {
            console.error(err);
            // handler内で何らかのエラーが発生した場合は、変更をロールバックする。
            tx.rollback();
            throw err;
          }
        });
        // レスポンスが生成されていなければ、戻り値を元に生成する。
        if (res.statusCode == 0) {
          res.status(200).json(returnValue);
        }
        // DBのコネクションを解放
        db.release();
      }
      asyncHandler()
        .catch(err => {
          next(err);
        });
    };
  }

  /**
   * APIエンドポイント向けのリクエストハンドラを生成します。
   * 
   * 渡されたAPIハンドラによってレスポンスが生成されない場合(ステータスコードが0かどうかで判定されます)、
   * レスポンスはこのリクエストハンドラによって生成されます。
   * 
   * APIハンドラの実行中にエラーが発生した場合、throw文でエラーが投げられます。
   * そのエラーはHttpServerServiceで定義されるエラーハンドラでキャッチされ、エラーレスポンスが生成されます。
  */
  create(
    handler: (ctx: { req: express.Request, res: express.Response, db: Database }) => Promise<unknown> | unknown
  ): express.RequestHandler {
    return (req, res, next) => {
      const asyncHandler = async () => {
        res.statusCode = 0;
        // DBのコネクションプールからコネクションを取得
        const db = await this.databaseService.acquire();
        const returnValue = await handler({ req, res, db });
        // レスポンスが生成されていなければ、戻り値を元に生成する。
        if (res.statusCode == 0) {
          res.status(200).json(returnValue);
        }
        // DBのコネクションを解放
        db.release();
      }
      asyncHandler()
        .catch(err => {
          next(err);
        });
    };
  }
}
