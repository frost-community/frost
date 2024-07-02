import { Module } from '@nestjs/common';
import { ApiRouteModule } from './api/apiRoute.module';

@Module({
  imports: [
    ApiRouteModule
  ]
})
export class RootRouteModule {}
