import { CreateMarqueInput } from './create-marque.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { StatutMarque } from '../entities/marque.entity';

@InputType()
export class UpdateMarqueInput extends PartialType(CreateMarqueInput) {
  @Field(() => String)
  _id: string;
  @Field(() =>String)
  statut: StatutMarque;
} 

