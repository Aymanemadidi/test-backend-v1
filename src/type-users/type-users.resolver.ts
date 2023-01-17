import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TypeUsersService } from './type-users.service';
import { TypeUser } from './entities/type-user.entity';
import { CreateTypeUserInput } from './dto/create-type-user.input';
import { UpdateTypeUserInput } from './dto/update-type-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';

@Resolver(() => TypeUser)
export class TypeUsersResolver {
  constructor(private readonly typeUsersService: TypeUsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Mutation(() => TypeUser)
  createTypeUser(@Args('createTypeUserInput') createTypeUserInput: CreateTypeUserInput) {
    return this.typeUsersService.create(createTypeUserInput);
  }

  @Query(() => [TypeUser], { name: 'typeUsers' })
  findAll() {
    return this.typeUsersService.findAll();
  }

  @Query(() => TypeUser, { name: 'typeUser' })
  findOne(@Args('_id', { type: () => String }) id: string) {
    return this.typeUsersService.findOne(id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Mutation(() => TypeUser)
  updateTypeUser(@Args('updateTypeUserInput') updateTypeUserInput: UpdateTypeUserInput) {
    return this.typeUsersService.update(updateTypeUserInput._id, updateTypeUserInput);
  }
  
  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Mutation(() => TypeUser)
  removeTypeUser(@Args('_id') id: string) {
    return this.typeUsersService.remove(id);
  }
}
