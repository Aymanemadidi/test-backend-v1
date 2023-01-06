import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LoggedUserOutput } from './dto/logged-user.output';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
// import { OnlySameUserByIdAllowed } from '../common/user.interceptor';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/enums/role.enum';
import { JwtRtAuthGuard } from 'src/common/auth/jwt-rt.guard';
// import { AtGuard } from '../common/auth/at.guard';
// import { LoginBuyerInput } from 'src/buyer/dto/login-buyer.input';
// import { LoggedBuyerOutput } from 'src/buyer/dto/loged-buyer.output';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Query(() => User)
  // getMe() {
  //   return this.usersService.getMe
  // }
  @Mutation(() => LoggedUserOutput)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.SUPADMIN])
  @Mutation(() => User)
  createAdminBySupAdm(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    return this.usersService.create(createUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN])
  @Mutation(() => Boolean)
  archiveUser(@Args('_id') id: string) {
    return this.usersService.archive(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN])
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

  @Mutation(() => Boolean)
  removeUser(@Args('_id') id: string) {
    return this.usersService.remove(id);
  }

  @Mutation(() => LoggedUserOutput)
  loginUser(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() ctx: any,
  ) {
    return this.usersService.loginUser(loginUserInput, ctx);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  logoutUser(@Context() ctx: any) {
    return this.usersService.logout(ctx);
  }

  // @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'getMe' })
  getMe(@Context() ctx: any) {
    return this.usersService.getMe(ctx);
  }

  @UseGuards(JwtRtAuthGuard)
  @Mutation(() => LoggedUserOutput)
  refresh(@Args('_id') id: string, @Args('rt') rt: string) {
    return this.usersService.refreshTokens(id, rt);
  }
}
