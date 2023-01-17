import { Test, TestingModule } from '@nestjs/testing';
import { TypeUsersService } from './type-users.service';

describe('TypeUsersService', () => {
  let service: TypeUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeUsersService],
    }).compile();

    service = module.get<TypeUsersService>(TypeUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
