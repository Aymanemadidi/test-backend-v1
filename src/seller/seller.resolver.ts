import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { SellerService } from './seller.service';
import { Seller } from './entities/seller.entity';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
import { LoggedSellerOutput } from './dto/loged-seller.output';
import { LoginSellerInput } from './dto/login-seller.input';
import { Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { JwtRtAuthGuard } from 'src/common/auth/jwt-rt.guard';
import { TestAuthGuard } from 'src/common/auth/test.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/enums/role.enum';
import { Response } from 'express';

@Resolver(() => Seller)
export class SellerResolver {
  constructor(private readonly sellerService: SellerService) {}

  @Mutation(() => Seller)
  createSeller(
    @Args('createSellerInput') createSellerInput: CreateSellerInput,
    @Context() ctx: any,
  ) {
    return this.sellerService.create(createSellerInput, ctx);
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Mutation(() => Seller)
  createSellerByAdm(
    @Args('createSellerInput') createSellerInput: CreateSellerInput,
  ) {
    return this.sellerService.createByAdm(createSellerInput);
  }

  @UseGuards(JwtRtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Query(() => [Seller], { name: 'sellers' })
  findAll() {
    return this.sellerService.findAll();
  }

  @UseGuards(JwtRtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Query(() => [Seller], { name: 'sellersPro' })
  findAllPro() {
    return this.sellerService.findAllPro();
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Query(() => [Seller], { name: 'sellersOcc' })
  findAllWithOccurence(
    @Args('email', { type: () => String }) email: string,
    @Args('nomEntreprise', { type: () => String }) nomEntreprise: string,
    @Args('pseudo', { type: () => String }) pseudo: string,
    @Args('startDate', { type: () => String }) startDate: string,
    @Args('endDate', { type: () => String }) endDate: string,
    @Args('isPro', { type: () => Boolean, nullable: true }) isPro: boolean,
  ) {
    return this.sellerService.findAllWithOccurence(
      email,
      nomEntreprise,
      pseudo,
      startDate,
      endDate,
      isPro,
    );
  }

  @Query(() => Seller, { name: 'seller' })
  findOne(@Args('_id', { type: () => String }) id: string) {
    return this.sellerService.findOne(id);
  }

  @Mutation(() => Seller)
  updateSeller(
    @Args('_id') id: string,
    @Args('updateSellerInput') updateSellerInput: UpdateSellerInput,
  ) {
    return this.sellerService.update(id, updateSellerInput);
  }

  @Mutation(() => Boolean)
  removeSeller(@Args('_id') id: string) {
    return this.sellerService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LoggedSellerOutput)
  loginSeller(
    @Args('loginSellerInput') loginSellerInput: LoginSellerInput,
    @Context() ctx: any,
  ) {
    return this.sellerService.loginSeller(loginSellerInput, ctx);
  }

  @Mutation(() => Boolean)
  logoutSeller(@Context() ctx: any) {
    return this.sellerService.logout(ctx);
  }

  @UseGuards(JwtRtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Query(() => [Seller], { name: 'sellersWithTypes' })
  findAllAgregate() {
    return this.sellerService.findAllAgregate();
  }
}
