import { CreateBuyerInput } from './create-buyer.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBuyerInput extends PartialType(CreateBuyerInput) {
  @Field(() => Int)
  _id: number;
}
