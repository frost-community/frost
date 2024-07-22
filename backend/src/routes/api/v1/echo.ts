import express from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../container/types';

@injectable()
export class EchoRoute {
  constructor() {}

  create() {
    const router = express.Router();

    router.get('/echo', (req, res) => {
      res.status(200).json(req.query);
    });

    router.post('/echo', (req, res) => {
      res.status(200).json(req.body);
    });

    return router;
  }
}
