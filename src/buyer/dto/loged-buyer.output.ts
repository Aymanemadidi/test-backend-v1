import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoggedBuyerOutput {
  @Field(() => String, { description: 'Generated access_token of the buyer' })
  access_token: string;
}
