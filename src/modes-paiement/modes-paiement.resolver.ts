import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ModesPaiementService } from './modes-paiement.service';
import { ModesPaiement } from './entities/modes-paiement.entity';
import { CreateModesPaiementInput } from './dto/create-modes-paiement.input';
import { UpdateModesPaiementInput } from './dto/update-modes-paiement.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';

@Resolver(() => ModesPaiement)
export class ModesPaiementResolver {
  constructor(private readonly modesPaiementService: ModesPaiementService) {}

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Mutation(() => ModesPaiement)
  createModesPaiement(@Args('createModesPaiementInput') createModesPaiementInput: CreateModesPaiementInput) {
    return this.modesPaiementService.create(createModesPaiementInput);
  }

  @Query(() => [ModesPaiement], { name: 'modesPaiement' })
  findAll() {
    return this.modesPaiementService.findAll();
  }

  @Query(() => ModesPaiement, { name: 'modePaiement' })
  findOne(@Args('_id', { type: () => String }) id: string) {
    return this.modesPaiementService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Mutation(() => ModesPaiement)
  updateModesPaiement(@Args('updateModesPaiementInput') updateModesPaiementInput: UpdateModesPaiementInput) {
    return this.modesPaiementService.update(updateModesPaiementInput._id, updateModesPaiementInput);
  }

  @UseGuards(JwtAuthGuard)
  @Roles([Role.ADMIN, Role.SUPADMIN])
  @Mutation(() => ModesPaiement)
  removeModesPaiement(@Args('_id') id: string) {
    return this.modesPaiementService.remove(id);
  }
}
