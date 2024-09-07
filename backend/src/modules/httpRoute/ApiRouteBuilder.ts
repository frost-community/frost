import express from "express";
import { Container } from "inversify";
import { TYPES } from "../../container/types";
import { UserEntity } from "../entities";
import { authenticate } from "./authentication";
import { ApiRouteContext } from "./ApiRouteContext";
import { PrismaClient } from "@prisma/client";

export class ApiRouteBuilder {
  public router: express.Router;

  constructor(
    private container: Container,
  ) {
    this.router = express.Router();
  }

  public register<R>(
    params: {
      method: 'GET' | 'POST' | 'DELETE'
      path: string,
      scope?: string | string[],
      requestHandler: (ctx: ApiRouteContext) => Promise<R>,
    },
  ) {
    const middlewares = createMiddlewareStack<R>(params.method, params.scope, this.container, params.requestHandler);
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

function createMiddlewareStack<R>(
  method: 'POST' | 'DELETE' | 'GET',
  requiredScope: string | string[] | undefined,
  container: Container,
  handler: (ctx: ApiRouteContext) => Promise<R> | R
): express.RequestHandler[] {
  const middlewares: express.RequestHandler[] = [];

  // authenticate
  if (requiredScope != null) {
    if (typeof requiredScope == 'string' || requiredScope.length > 0) {
      middlewares.push(...authenticate(requiredScope));
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
    let user: UserEntity | undefined;
    let scopes: string[] | undefined;
    if (req.authInfo != null) {
      user = req.user as UserEntity;
      scopes = (req.authInfo as { scope: string[] }).scope;
    }

    async function asyncHandler() {
      let returnValue;
      const db = container.get<PrismaClient>(TYPES.db);
      try {
        if (method == 'POST' || method == 'DELETE') {
          // 変更操作(POST, DELETE)の場合はトランザクションを開始
          returnValue = await db.$transaction(async (tx) => {
            container.rebind(TYPES.db).toConstantValue(tx);
            return await handler(new ApiRouteContext(params, container, req, res, user, scopes));
          });
        } else {
          // 読み出し操作の場合はそのままハンドラを呼ぶ
          returnValue = await handler(new ApiRouteContext(params, container, req, res, user, scopes));
        }
      } finally {
        container.rebind(TYPES.db).toConstantValue(db);
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
