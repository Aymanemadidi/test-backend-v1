import { InputType, Int, Field } from '@nestjs/graphql';
import { StatutModePaiement } from '../entities/modes-paiement.entity';

@InputType()
export class CreateModesPaiementInput {
  @Field(() =>String, { description: 'Mode de paiement' })
  mode_paiement: string;
  @Field(() =>String, { description: 'Description Mode de paiement' })
  description: string;
  statut: StatutModePaiement;
  created_at: Date;
}
