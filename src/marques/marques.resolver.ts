import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MarquesService } from './marques.service';
import { Marque } from './entities/marque.entity';
import { CreateMarqueInput } from './dto/create-marque.input';
import { UpdateMarqueInput } from './dto/update-marque.input';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Role } from 'src/roles/enums/role.enum';
import { Roles } from 'src/roles/roles.decorator';

@Resolver(() => Marque)
export class MarquesResolver {
  constructor(private readonly marquesService: MarquesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Marque)
  createMarque(
    @Args('createMarqueInput') createMarqueInput: CreateMarqueInput,
  ) {
    return this.marquesService.create(createMarqueInput);
  }

  @Query(() => [Marque], { name: 'marques' })
  findAll() {
    return this.marquesService.findAll();
  }

  @Query(() => Marque, { name: 'marque' })
  findOne(@Args('_id', { type: () => String }) id: string) {
    return this.marquesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Marque)
  updateMarque(
    @Args('updateMarqueInput') updateMarqueInput: UpdateMarqueInput,
  ) {
    return this.marquesService.update(updateMarqueInput._id, updateMarqueInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Mutation(() => Boolean)
  removeMarque(@Args('_id') id: string) {
    return this.marquesService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Mutation(() => Boolean)
  removeAll() {
    return this.marquesService.removeAll();
  }
}
