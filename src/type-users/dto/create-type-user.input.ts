import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTypeUserInput {
  @Field(() => String, { description: 'Libelle type utilisateur' })
  libelle: string;
  @Field(() => Boolean, { description: 'utilisé pour vendeur?' })
  for_seller: boolean;
  @Field(() => Boolean, { description: 'utilisé pour acheteur?' })
  for_buyer: boolean;
  @Field(() => String, { description: 'Description type utilisateur' })
  description: string;
  created_at: Date;
}
