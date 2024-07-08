import { App } from './app';

async function bootstrap() {
  const app = App.create();
  await app.listen(3000);
}
bootstrap();
