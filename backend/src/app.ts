import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { HttpServerService } from './services/HttpServerService';
import { TYPES } from './types';
import { createContainer } from './inversify.config';

@injectable()
export class App {
  constructor(
    @inject(TYPES.HttpServerService) private readonly http: HttpServerService,
  ) {}

  static create() {
    const container = createContainer();
    const app = container.get<App>(TYPES.App);
    return app;
  }

  async listen(port: number): Promise<void> {
    this.http.listen(port);
  }
}
