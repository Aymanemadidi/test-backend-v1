import { Test, TestingModule } from '@nestjs/testing';
import { MarquesService } from './marques.service';

describe('MarquesService', () => {
  let service: MarquesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarquesService],
    }).compile();

    service = module.get<MarquesService>(MarquesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
