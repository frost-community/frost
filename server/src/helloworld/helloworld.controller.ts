import { Controller, Get } from '@nestjs/common';
import { HelloworldService } from './helloworld.service.js';

@Controller()
export class HelloworldController {
  constructor(private readonly helloworldService: HelloworldService) {}

  @Get()
  getHello(): string {
    return this.helloworldService.getHello();
  }
}
