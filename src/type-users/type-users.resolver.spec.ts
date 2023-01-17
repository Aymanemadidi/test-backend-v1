import { Test, TestingModule } from '@nestjs/testing';
import { TypeUsersResolver } from './type-users.resolver';
import { TypeUsersService } from './type-users.service';

describe('TypeUsersResolver', () => {
  let resolver: TypeUsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeUsersResolver, TypeUsersService],
    }).compile();

    resolver = module.get<TypeUsersResolver>(TypeUsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
