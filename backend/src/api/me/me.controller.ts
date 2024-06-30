import { Controller, Get } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { User, UserService } from 'src/user/user.service';

@Controller('api/me')
export class MeController {
  constructor(private readonly userService: UserService, private readonly accountService: AccountService) {}

  @Get()
  GetMe(): User {
    // TODO: get userId of self
    return this.userService.GetUser('1');
  }
}
