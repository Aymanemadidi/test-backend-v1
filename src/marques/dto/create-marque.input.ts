import { InputType, Int, Field } from '@nestjs/graphql';
import { StatutMarque } from '../entities/marque.entity';

@InputType()
export class CreateMarqueInput {
  @Field(() => String, { description: 'Libelle marque' })
  libelle: string;
  statut: StatutMarque;
  created_at: Date;
}
