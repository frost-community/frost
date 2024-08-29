import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { ApiVer1Router } from './apiVer1';

@injectable()
export class RootRouter {
  constructor(
    @inject(TYPES.ApiVer1Router) private readonly apiVer1Router: ApiVer1Router
  ) {}

  public create() {
    const router = express.Router();

    router.use('/api/v1', this.apiVer1Router.create());

    return router;
  }
}
