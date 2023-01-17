import { Test, TestingModule } from '@nestjs/testing';
import { ModesPaiementResolver } from './modes-paiement.resolver';
import { ModesPaiementService } from './modes-paiement.service';

describe('ModesPaiementResolver', () => {
  let resolver: ModesPaiementResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModesPaiementResolver, ModesPaiementService],
    }).compile();

    resolver = module.get<ModesPaiementResolver>(ModesPaiementResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
