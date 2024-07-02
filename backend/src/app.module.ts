import { Module } from '@nestjs/common';
import { RootRouteModule } from './routes/rootRoute';

@Module({
  imports: [RootRouteModule]
})
export class AppModule { }
