import { Test, TestingModule } from '@nestjs/testing';
import { BuyerResolver } from './buyer.resolver';
import { BuyerService } from './buyer.service';

describe('BuyerResolver', () => {
  let resolver: BuyerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyerResolver, BuyerService],
    }).compile();

    resolver = module.get<BuyerResolver>(BuyerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
