import { CreateTypeUserInput } from './create-type-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTypeUserInput extends PartialType(CreateTypeUserInput) {
  @Field(() => String)
  _id: string;
}
