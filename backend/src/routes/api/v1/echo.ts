import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';
import { api } from 'src/util/api';

@injectable()
export class EchoRoute {
  constructor() {}

  create() {
    const router = express.Router();

    router.get('/echo', api((req, res) => {
      res.status(200).json(req.query);
    }));

    router.post('/echo', api((req, res) => {
      res.status(200).json(req.body);
    }));

    return router;
  }
}
