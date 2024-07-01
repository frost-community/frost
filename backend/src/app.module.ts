import { Module } from '@nestjs/common';
import { AccountsControllerModule } from './controllers/accounts/accountsController.module';
import { MeControllerModule } from './controllers/me/meController.module';
import { AccountServiceModule } from './services/account/accountService.module';
import { UserServiceModule } from './services/user/userService.module';

@Module({
  // ここに全てのモジュールを記載
  imports: [
    // controllers
    AccountsControllerModule,
    MeControllerModule,

    // services
    AccountServiceModule,
    UserServiceModule
  ]
})
export class AppModule { }
