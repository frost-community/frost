import { Module } from '@nestjs/common';
import { RootRouteModule } from './routes/rootRoute.module';

@Module({
  imports: [RootRouteModule]
})
export class AppModule { }
