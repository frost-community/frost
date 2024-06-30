import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { UserService } from 'src/user/user.service';
import { AccountService } from 'src/account/account.service';

@Module({
  imports: [],
  controllers: [MeController],
  providers: [UserService, AccountService]
})
export class MeModule {}
