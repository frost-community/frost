import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { HttpServerService } from './services/HttpServerService';
import { TYPES } from './container/types';
import { DatabaseService } from './services/DatabaseService';

export type AppConfig = {
  port: number,
  env: 'development' | 'production' | 'test',
};

@injectable()
export class App {
  constructor(
    @inject(TYPES.HttpServerService) private readonly http: HttpServerService,
    @inject(TYPES.DatabaseService) private readonly db: DatabaseService,
  ) {}

  async run(): Promise<void> {
    await this.db.connect();
    await this.http.listen();
  }
}
