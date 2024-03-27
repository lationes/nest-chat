import { Test, TestingModule } from '@nestjs/testing';
import { AddRequestService } from './add-request.service';

describe('AddRequestService', () => {
  let service: AddRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddRequestService],
    }).compile();

    service = module.get<AddRequestService>(AddRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
