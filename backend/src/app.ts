import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { HttpServerService } from './services/HttpServerService';
import { TYPES } from './types';

export type AppConfig = {
  port: number,
};

@injectable()
export class App {
  constructor(
    @inject(TYPES.HttpServerService) private readonly http: HttpServerService,
  ) {}

  async run(): Promise<void> {
    return this.http.listen();
  }
}
