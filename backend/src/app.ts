import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { HttpServerService } from './services/HttpServerService';
import { TYPES } from './container/types';
import { DatabaseService } from './services/DatabaseService';

export type AppConfig = {
  port: number,
  env: 'development' | 'production' | 'test',
  db: {
    connectionString: string,
    maxPool?: number,
  },
};

@injectable()
export class App {
  constructor(
    @inject(TYPES.HttpServerService) private readonly http: HttpServerService,
  ) {}

  async run(): Promise<void> {
    // TODO: validate app config
    await this.http.listen();
  }
}
