import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LoggedUserOutput } from './dto/logged-user.output';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { OnlySameUserByIdAllowed } from '../common/user.interceptor';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/enums/role.enum';
import { AtGuard } from '../common/auth/at.guard';
// import { LoginBuyerInput } from 'src/buyer/dto/login-buyer.input';
// import { LoggedBuyerOutput } from 'src/buyer/dto/loged-buyer.output';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => LoggedUserOutput)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.SUPADMIN)
  @Mutation(() => User)
  createAdminBySupAdm(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    return this.usersService.create(createUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  archiveUser(@Args('_id') id: string) {
    return this.usersService.archive(id);
  }

  @UseGuards(JwtAuthGuard)
  // @Roles(Role.ADMIN)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('_id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  // @UseInterceptors(OnlySameUserByIdAllowed)
  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput')
    updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(updateUserInput._id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('_id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }

  @Mutation(() => LoggedUserOutput)
  loginUser(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.usersService.loginUser(loginUserInput);
  }

  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  logoutUser(@Args('_id') id: string) {
    return this.usersService.logout(id);
  }
}
