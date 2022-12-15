import { Test, TestingModule } from '@nestjs/testing';
import { SellerResolver } from './seller.resolver';
import { SellerService } from './seller.service';

describe('SellerResolver', () => {
  let resolver: SellerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerResolver, SellerService],
    }).compile();

    resolver = module.get<SellerResolver>(SellerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
