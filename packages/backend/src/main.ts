import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

class Logger {
	log(message: any, ...optionalParams: any[]) { console.log(message); }
	error(message: any, ...optionalParams: any[]) { console.log(message); }
	warn(message: any, ...optionalParams: any[]) { console.log(message); }
}

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
		{ logger: new Logger() }
	);
	await app.listen(3000);
}
bootstrap();
