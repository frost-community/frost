import { Container, inject, injectable } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { AppConfig } from '../../app';
import { TYPES } from '../../types';

@injectable()
export class HttpServerService {
  constructor(
    @inject(TYPES.Container) private readonly container: Container,
    @inject(TYPES.AppConfig) private readonly appConfig: AppConfig,
  ) {}

  listen(): Promise<void> {
    const server = new InversifyExpressServer(this.container);

    server.setConfig((app) => {});

    return new Promise(resolve => {
      server
        .build()
        .listen(this.appConfig.port, () => resolve());
    });
  }
}
