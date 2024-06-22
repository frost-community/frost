import { Module } from '@nestjs/common';
import { HelloworldModule } from './helloworld/helloworld.module.js';

@Module({
  imports: [HelloworldModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
