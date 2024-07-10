import { Container } from 'inversify';
import { App } from './app';
import { TYPES } from './types';
import { setupContainer } from './inversify.config';

function bootstrap(): Promise<void> {
  const container = new Container();
  container.bind<Container>(TYPES.Container).toConstantValue(container);

  setupContainer(container);

  const app = container.get<App>(TYPES.App);
  return app.run()
    .catch(err => {
      console.log('Error:', err);
    });
}
bootstrap();
