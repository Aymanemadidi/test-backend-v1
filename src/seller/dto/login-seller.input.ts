import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginSellerInput {
  @Field(() => String, { description: 'email of the user' })
  email: string;
  @Field(() => String, { description: 'password of the user' })
  password: string;
}
