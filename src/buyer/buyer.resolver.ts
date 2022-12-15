import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BuyerService } from './buyer.service';
import { Buyer } from './entities/buyer.entity';
import { CreateBuyerInput } from './dto/create-buyer.input';
import { UpdateBuyerInput } from './dto/update-buyer.input';
import { LoggedBuyerOutput } from './dto/loged-buyer.output';
import { LoginBuyerInput } from './dto/login-buyer.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';

@Resolver(() => Buyer)
export class BuyerResolver {
  constructor(private readonly buyerService: BuyerService) {}

  @Mutation(() => Buyer)
  createBuyer(@Args('createBuyerInput') createBuyerInput: CreateBuyerInput) {
    return this.buyerService.create(createBuyerInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Buyer)
  createBuyerByAdm(
    @Args('createBuyerInput') createBuyerInput: CreateBuyerInput,
  ) {
    return this.buyerService.create(createBuyerInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Query(() => [Buyer], { name: 'buyers' })
  findAll() {
    return this.buyerService.findAll();
  }

  @Query(() => Buyer, { name: 'buyer' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.buyerService.findOne(id);
  }

  @Mutation(() => Buyer)
  updateBuyer(@Args('updateBuyerInput') updateBuyerInput: UpdateBuyerInput) {
    return this.buyerService.update(updateBuyerInput._id, updateBuyerInput);
  }

  @Mutation(() => Buyer)
  removeBuyer(@Args('id', { type: () => Int }) id: string) {
    return this.buyerService.remove(id);
  }

  @Mutation(() => LoggedBuyerOutput)
  loginBuyer(@Args('loginBuyerInput') LoginBuyerInput: LoginBuyerInput) {
    return this.buyerService.loginBuyer(LoginBuyerInput);
  }
}
