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
import { AllUsersOutput } from './dto/all-users-output';
import { Seller } from 'src/seller/entities/seller.entity';
// import { AtGuard } from '../common/auth/at.guard';
// import { LoginBuyerInput } from 'src/buyer/dto/login-buyer.input';
// import { LoggedBuyerOutput } from 'src/buyer/dto/loged-buyer.output';

const User2 = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  statut: '',
};

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

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
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Mutation(() => Boolean)
  archiveUser(@Args('_id') id: string) {
    return this.usersService.archive(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Query(() => [User], { name: 'admins' })
  findAllAdmins() {
    return this.usersService.findAllAdmins();
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Query(() => [AllUsersOutput], { name: 'users2' })
  findAll2() {
    return this.usersService.findAll2();
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Query(() => [AllUsersOutput], { name: 'adminsOcc' })
  findAdminsWithOccurence(
    @Args('email', { type: () => String }) email: string,
    @Args('startDate', { type: () => String }) startDate: string,
    @Args('endDate', { type: () => String }) endDate: string,
    @Args('statut', { type: () => String }) statut: string,
  ) {
    return this.usersService.findAdminsWithOccurence(
      email,
      startDate,
      endDate,
      statut,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Query(() => [AllUsersOutput], { name: 'usersOcc' })
  findAllWithOccurence(
    @Args('email', { type: () => String }) email: string,
    @Args('nomEntreprise', { type: () => String }) nomEntreprise: string,
    @Args('pseudo', { type: () => String }) pseudo: string,
    @Args('startDate', { type: () => String }) startDate: string,
    @Args('endDate', { type: () => String }) endDate: string,
    @Args('statut', { type: () => String }) statut: string,
    @Args('type', { type: () => String }) type: string,
  ) {
    return this.usersService.findAllWithOccurence(
      email,
      nomEntreprise,
      pseudo,
      startDate,
      endDate,
      statut,
      type,
    );
  }

  @Query(() => [User], { name: 'user' })
  findOne(@Args('_id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  // @UseInterceptors(OnlySameUserByIdAllowed)
  @Mutation(() => User)
  updateUser(
    @Args('_id') id: string,
    @Args('updateUserInput')
    updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(id, updateUserInput);
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

  @UseGuards(JwtAuthGuard)
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
