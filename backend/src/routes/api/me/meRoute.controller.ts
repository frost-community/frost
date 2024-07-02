import { Controller, Get } from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Controller('api/me')
export class MeRouteController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(): User {
    // TODO: get userId of self
    return this.userService.GetUser('1');
  }
}
