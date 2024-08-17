import 'reflect-metadata';
import { Container, inject, injectable } from 'inversify';
import { createHttpServer } from './modules/httpServer';
import { TYPES } from './container/types';

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
    @inject(TYPES.Container) private readonly container: Container,
  ) {}

  async run(): Promise<void> {
    // TODO: validate app config
    await createHttpServer(this.container);
  }
}
