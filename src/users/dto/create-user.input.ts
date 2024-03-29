import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../../roles/enums/role.enum';

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
  role: Role;
  @Field(() => String, { description: 'password of the user' })
  password: string;
  @Field(() => String, { description: 'mobile of the Admin', nullable: true })
  mobileNumber: string;
  @Field(() => String, { description: 'statut of the Admin', nullable: true })
  statut: string;
  @Field(() => Boolean, {
    description: 'isArchived of the Admin',
    nullable: true,
  })
  isArchived: boolean;
}
