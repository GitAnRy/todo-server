import { Test, TestingModule } from '@nestjs/testing';
import { ProgectsService } from './progects.service';

describe('ProgectsService', () => {
  let service: ProgectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgectsService],
    }).compile();

    service = module.get<ProgectsService>(ProgectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
