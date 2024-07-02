import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { MeRouteController } from './meRoute.controller';

@Module({
  controllers: [MeRouteController],
  imports: [UserModule]
})
export class MeRouteModule {}
