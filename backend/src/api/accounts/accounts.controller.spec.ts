import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller.js';
import { AccountService } from './account.service.js';

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
