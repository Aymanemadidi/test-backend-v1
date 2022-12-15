import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoggedSellerOutput {
  @Field(() => String, { description: 'Generated access_token of the sellerr' })
  access_token: string;
}
