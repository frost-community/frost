import { Controller, Get, Module } from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';
import { UserModule } from 'src/modules/user/user.module';
import { UserService } from 'src/modules/user/user.service';

@Controller('api/me')
export class MeController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(): User {
    // TODO: get userId of self
    return this.userService.GetUser('1');
  }
}

@Module({
  controllers: [MeController],
  imports: [UserModule]
})
export class MeRouteModule {}
