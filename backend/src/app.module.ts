import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module.js';

@Module({
  imports: [ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
