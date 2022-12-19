import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoggedBuyerOutput {
  @Field(() => String, { description: 'Generated access_token of the buyer' })
  access_token: string;
  @Field(() => String, { description: 'Generated refresh_token of the buyer' })
  refresh_token: string;
}
