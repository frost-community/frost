import { Module } from '@nestjs/common';
import { HelloworldController } from './helloworld.controller.js';
import { HelloworldService } from './helloworld.service.js';

@Module({
  imports: [],
  controllers: [HelloworldController],
  providers: [HelloworldService],
})
export class HelloworldModule { }
