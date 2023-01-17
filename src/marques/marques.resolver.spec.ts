import { Test, TestingModule } from '@nestjs/testing';
import { MarquesResolver } from './marques.resolver';
import { MarquesService } from './marques.service';

describe('MarquesResolver', () => {
  let resolver: MarquesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarquesResolver, MarquesService],
    }).compile();

    resolver = module.get<MarquesResolver>(MarquesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
