import 'reflect-metadata';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from './container/types';
import { createHttpServer } from './modules/httpServer';
import { readFileSync } from 'fs';

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

  public async run(): Promise<void> {
    console.log('+----------------------------------+');
    console.log('|          Frost *                 |');
    console.log('|          backend server          |');
    console.log('+----------------------------------+');
    const projectInfo = JSON.parse(readFileSync('../package.json', { encoding: 'utf8' }));
    console.log('Version ' + projectInfo.version);
    console.log();

    // TODO: validate app config
    await createHttpServer(this.container);
  }
}
