import { Test, TestingModule } from '@nestjs/testing';
import { HelloworldController } from './helloworld.controller.js';
import { HelloworldService } from './helloworld.service.js';

describe('HelloworldController', () => {
  let helloworldController: HelloworldController;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      controllers: [HelloworldController],
      providers: [HelloworldService],
    }).compile();

    helloworldController = mod.get<HelloworldController>(HelloworldController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(helloworldController.getHello()).toBe('Hello World!');
    });
  });
});
