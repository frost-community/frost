import express from "express";
import { UserEntity } from "../types/entities";
import { ConnectionLayers, ConnectionPool } from "./database";
import { Container } from "inversify";
import { TYPES } from "../container/types";
import { authenticate } from "./httpAuthentication";

export type HandlerContext<P> = {
  params: P,
  auth?: {
    userId: string,
    user?: UserEntity,
    scope: string[],
  },
  db: ConnectionLayers,
  req: express.Request,
  res: express.Response,
};

export class HttpRouteBuilder {
  private connectionPool: ConnectionPool;

  constructor(
    private router: express.Router,
    container: Container,
  ) {
    this.connectionPool = container.get<ConnectionPool>(TYPES.ConnectionPool);
  }

  public build<P, R>(
    params: {
      method: 'GET' | 'POST' | 'DELETE'
      path: string,
      scope?: string | string[],
      requestHandler: (ctx: HandlerContext<P>) => Promise<R>,
    },
  ) {
    const middlewares = createMiddlewareStack<P, R>(params.method, params.scope, this.connectionPool, params.requestHandler);
    switch (params.method) {
      case 'POST': {
        this.router.post(params.path, ...middlewares);
        break;
      }
      case 'DELETE': {
        this.router.delete(params.path, ...middlewares);
        break;
      }
      case 'GET': {
        this.router.get(params.path, ...middlewares);
        break;
      }
    }
  }
}

function createMiddlewareStack<P, R>(
  method: 'POST' | 'DELETE' | 'GET',
  requiredScope: string | string[] | undefined,
  connectionPool: ConnectionPool,
  handler: (ctx: HandlerContext<P>) => Promise<R> | R
): express.RequestHandler[] {
  const middlewares: express.RequestHandler[] = [];

  // authenticate
  if (requiredScope != null) {
    if (typeof requiredScope == 'string' || requiredScope.length > 0) {
      middlewares.push(...authenticate({ scope: requiredScope }));
    }
  }

  // request handling
  middlewares.push((req, res, next) => {
    // statusCode = 0でレスポンスが設定されていないことを示す
    res.statusCode = 0;

    // ハンドラ用のパラメータオブジェクト
    let params: any;
    if (method == 'GET' || method == 'DELETE') {
      params = req.query;
    } else if (method == 'POST') {
      params = req.body;
    } else {
      return next(new Error('unsupported http method'));
    }

    // ハンドラ用の認証情報
    let auth: {
      userId: string,
      user?: UserEntity,
      scope: string[],
    } | undefined;
    if (req.authInfo != null) {
      const user = req.user as UserEntity;
      const scope: string[] = (req.authInfo as any).scope;
      auth = {
        userId: user.userId,
        user: user,
        scope,
      };
    }

    async function asyncHandler() {
      let returnValue;
      let db: ConnectionLayers | undefined;
      try {
        db = await connectionPool.acquire();
        if (method == 'POST' || method == 'DELETE') {
          // 変更操作(POST, DELETE)の場合はトランザクションを開始
          returnValue = await db.execAction(async (tx) => {
            try {
              return await handler({
                params,
                auth,
                db: db as ConnectionLayers,
                req,
                res,
              });
            } catch (err) {
              console.error(err);
              // handler内で何らかのエラーが発生した場合は、変更をロールバックする。
              tx.rollback();
              throw err;
            }
          });
        } else {
          // 読み出し操作の場合はそのままハンドラを呼ぶ
          returnValue = await handler({
            params,
            auth,
            db,
            req,
            res,
          });
        }
      } finally {
        // DBのコネクションを解放
        if (db != null) db.dispose();
      }
      // ハンドラ内でレスポンスが設定されなければ、200 OKとしてレスポンスを生成する。
      if (res.statusCode == 0) {
        res.status(200).json(returnValue);
      }
    }
    asyncHandler().catch(err => {
      next(err);
    });
  });

  return middlewares;
}
