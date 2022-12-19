import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoggedUserOutput {
  @Field(() => String, { description: 'Generated access_token of the user' })
  access_token: string;
  @Field(() => String, { description: 'Generated refresh_token of the user' })
  refresh_token: string;
}
