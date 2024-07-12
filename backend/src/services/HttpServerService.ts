import { Container, inject, injectable } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { AppConfig } from '../app';
import { TYPES } from '../container/types';

// controllers
import '../controllers/RootController';
import '../controllers/api/MeController';
import '../controllers/api/UsersController';

@injectable()
export class HttpServerService {
  constructor(
    @inject(TYPES.Container) private readonly container: Container,
    @inject(TYPES.AppConfig) private readonly config: AppConfig,
  ) {}

  listen(): Promise<void> {
    const server = new InversifyExpressServer(this.container);

    server.setConfig(app => {
    });
    server.setErrorConfig(app => {
      app.use((req, res) => {
        res.status(404).json({ status: 404, message: 'Not found' });
      });
      // @ts-ignore
      app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ status: 500, message: 'Internal server error' });
      });
    });

    return new Promise(resolve => {
      server
        .build()
        .listen(this.config.port, () => resolve());
    });
  }
}
