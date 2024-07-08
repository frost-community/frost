import express from 'express';

export class HttpServerService {
  listen(port: number): Promise<void> {
    return new Promise(resolve => {
      const app = express();

      app.listen(port, () => {
        resolve();
      });
    });
  }
}
