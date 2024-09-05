import 'reflect-metadata';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from './container/types';
import { createHttpServer } from './modules/httpServer';
import { readFileSync } from 'fs';
import e from 'express';

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
    @inject(TYPES.AppConfig) private readonly config: AppConfig,
  ) {}

  public async run(): Promise<e.Express> {
    console.log('+----------------------------------+');
    console.log('|          Frost *                 |');
    console.log('|          backend server          |');
    console.log('+----------------------------------+');
    const projectInfo = JSON.parse(readFileSync('../package.json', { encoding: 'utf8' }));
    console.log('Version ' + projectInfo.version);
    console.log();

    // TODO: validate app config
    const server = await createHttpServer(this.container);

    await new Promise<void>(resolve => {
      server.listen(this.config.port, () => resolve());
    });
  
    console.log('listen on port ' + this.config.port);

    return server;
  }
}
