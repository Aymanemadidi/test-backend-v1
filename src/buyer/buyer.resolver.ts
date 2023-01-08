import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { BuyerService } from './buyer.service';
import { Buyer } from './entities/buyer.entity';
import { CreateBuyerInput } from './dto/create-buyer.input';
import { UpdateBuyerInput } from './dto/update-buyer.input';
import { LoggedBuyerOutput } from './dto/loged-buyer.output';
import { LoginBuyerInput } from './dto/login-buyer.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/enums/role.enum';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { Res } from '@nestjs/common';

@Resolver(() => Buyer)
export class BuyerResolver {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => Buyer)
  createBuyer(@Args('createBuyerInput') createBuyerInput: CreateBuyerInput) {
    return this.buyerService.create(createBuyerInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Mutation(() => Buyer)
  createBuyerByAdm(
    @Args('createBuyerInput') createBuyerInput: CreateBuyerInput,
  ) {
    return this.buyerService.create(createBuyerInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Query(() => [Buyer], { name: 'buyers' })
  findAll() {
    return this.buyerService.findAll();
  }

  @Query(() => Buyer, { name: 'buyer' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.buyerService.findOne(id);
  }

  @Mutation(() => Buyer)
  updateBuyer(
    @Args('_id') id: string,
    @Args('updateBuyerInput') updateBuyerInput: UpdateBuyerInput,
  ) {
    return this.buyerService.update(id, updateBuyerInput);
  }

  @Mutation(() => Boolean)
  removeBuyer(@Args('_id') id: string) {
    return this.buyerService.remove(id);
  }

  @Mutation(() => LoggedBuyerOutput)
  loginBuyer(
    @Args('loginBuyerInput') LoginBuyerInput: LoginBuyerInput,
    @Context() ctx: any,
  ) {
    // res.set('Set-Cookie', `${'test'}=${'test'}`);
    return this.buyerService.loginBuyer(LoginBuyerInput, ctx);
  }

  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  logoutBuyer(@Context() ctx: any) {
    return this.buyerService.logout(ctx);
  }
}
