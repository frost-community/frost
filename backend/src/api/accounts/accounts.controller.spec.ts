import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountService } from '../../account/account.service';

describe('AccountsController', () => {
  let controller: AccountsController;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [AccountService],
    }).compile();

    controller = mod.get<AccountsController>(AccountsController);
  });

  // TODO
});
