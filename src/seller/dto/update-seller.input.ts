import { CreateSellerInput } from './create-seller.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSellerInput extends PartialType(CreateSellerInput) {
  @Field(() => Int)
  _id: number;
}
