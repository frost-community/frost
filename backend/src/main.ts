import { Container } from 'inversify';
import { App } from './app';
import { setupContainer } from './container/inversify.config';
import { TYPES } from './container/types';

async function bootstrap(): Promise<void> {
  const container = new Container();
  setupContainer(container);

  const app = container.get<App>(TYPES.App);
  await app.run();
}
bootstrap()
  .catch(err => {
    console.log('Error:', err);
  });
