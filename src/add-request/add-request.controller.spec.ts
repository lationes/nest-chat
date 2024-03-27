import { Test, TestingModule } from '@nestjs/testing';
import { AddRequestController } from './add-request.controller';

describe('AddRequestController', () => {
  let controller: AddRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddRequestController],
    }).compile();

    controller = module.get<AddRequestController>(AddRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
