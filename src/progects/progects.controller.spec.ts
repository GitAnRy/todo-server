import { Test, TestingModule } from '@nestjs/testing';
import { ProgectsController } from './progects.controller';

describe('ProgectsController', () => {
  let controller: ProgectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgectsController],
    }).compile();

    controller = module.get<ProgectsController>(ProgectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
