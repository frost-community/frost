import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { UsersRouteController } from './UsersRoute.controller';

@Module({
  // このモジュールに含まれるコントローラー
  controllers: [UsersRouteController],

  // 依存モジュール
  imports: [UserModule]
})
export class UsersRouteModule {}
