import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SellerService } from './seller.service';
import { Seller } from './entities/seller.entity';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
import { LoggedSellerOutput } from './dto/loged-seller.output';
import { LoginSellerInput } from './dto/login-seller.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/enums/role.enum';

@Resolver(() => Seller)
export class SellerResolver {
  constructor(private readonly sellerService: SellerService) {}

  @Mutation(() => LoggedSellerOutput)
  createSeller(
    @Args('createSellerInput') createSellerInput: CreateSellerInput,
  ) {
    return this.sellerService.create(createSellerInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Seller)
  createSellerByAdm(
    @Args('createSellerInput') createSellerInput: CreateSellerInput,
  ) {
    return this.sellerService.create(createSellerInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Query(() => [Seller], { name: 'sellers' })
  findAll() {
    return this.sellerService.findAll();
  }

  @Query(() => Seller, { name: 'seller' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.sellerService.findOne(id);
  }

  @Mutation(() => Seller)
  updateSeller(
    @Args('updateSellerInput') updateSellerInput: UpdateSellerInput,
  ) {
    return this.sellerService.update(updateSellerInput._id, updateSellerInput);
  }

  @Mutation(() => Seller)
  removeSeller(@Args('id', { type: () => Int }) id: string) {
    return this.sellerService.remove(id);
  }

  @Mutation(() => LoggedSellerOutput)
  loginSeller(@Args('loginSellerInput') loginSellerInput: LoginSellerInput) {
    return this.sellerService.loginSeller(loginSellerInput);
  }
}
