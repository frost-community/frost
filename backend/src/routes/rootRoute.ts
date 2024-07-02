import { Module } from '@nestjs/common';
import { ApiRouteModule } from './api/apiRoute';

@Module({
  imports: [
    ApiRouteModule
  ]
})
export class RootRouteModule {}
