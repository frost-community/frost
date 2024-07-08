import { App } from './app';

async function bootstrap() {
  const app = await App.create();
  await app.listen(3000);
}
bootstrap();
