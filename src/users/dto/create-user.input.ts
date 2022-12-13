import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'first name of the user' })
  @IsNotEmpty()
  firstName: string;
  @Field(() => String, { description: 'last name of the user' })
  lastName: string;
  @Field(() => String, { description: 'email of the user' })
  @IsEmail()
  email: string;
  @Field(() => String, { description: 'role of the user' })
  role: string;
  @Field(() => String, { description: 'password of the user' })
  password: string;
}
