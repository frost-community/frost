import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloworldService {
  getHello(): string {
    return 'Hello World!';
  }
}
