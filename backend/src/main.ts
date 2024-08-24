import { Container } from 'inversify';
import { App } from './app';
import { TYPES } from './container/types';
import { setupContainer } from './container/inversify.config';

function bootstrap(): Promise<void> {
  const container = new Container();
  setupContainer(container);

  const app = container.get<App>(TYPES.App);
  return app.run()
    .catch(err => {
      console.log('Error:', err);
    });
}
bootstrap();
