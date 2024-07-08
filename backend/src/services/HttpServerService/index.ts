import express from 'express';
import { injectable } from 'inversify';

@injectable()
export class HttpServerService {
  listen(port: number): Promise<void> {
    return new Promise(resolve => {
      const app = express();

      app.get('/', (req, res) => {
        res.json({
          message: 'frost'
        });
      });

      app.listen(port, () => {
        resolve();
      });
    });
  }
}
