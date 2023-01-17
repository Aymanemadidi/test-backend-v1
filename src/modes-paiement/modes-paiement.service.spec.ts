import { Test, TestingModule } from '@nestjs/testing';
import { ModesPaiementService } from './modes-paiement.service';

describe('ModesPaiementService', () => {
  let service: ModesPaiementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModesPaiementService],
    }).compile();

    service = module.get<ModesPaiementService>(ModesPaiementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
