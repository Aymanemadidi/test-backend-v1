import { CreateModesPaiementInput } from './create-modes-paiement.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { StatutModePaiement } from '../entities/modes-paiement.entity';

@InputType()
export class UpdateModesPaiementInput extends PartialType(CreateModesPaiementInput) {
  @Field(() => String)
  _id: string;
  @Field(() =>String)
  statut: StatutModePaiement;
}
