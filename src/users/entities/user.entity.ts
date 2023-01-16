import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../roles/enums/role.enum';
@Schema()
@ObjectType()
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
  @Prop()
  @Field(() => String, { description: 'User firstName ' })
  firstName: string;
  @Prop()
  @Field(() => String, { description: 'User lastName ' })
  lastName: string;
  @Prop()
  @Field(() => String, { description: 'User email ' })
  email: string;
  @Prop()
  @Field(() => String, { description: 'User role' })
  role: Role;
  @Prop()
  @Field(() => String, { description: 'Admin statut', nullable: true })
  statut: string;
  @Prop()
  @Field(() => String, { description: 'Admin mobile number', nullable: true })
  mobileNumber: string;
  @Prop()
  @Field(() => Date, { description: 'User created_at', nullable: true })
  created_at: Date;
  @Prop()
  // @Field(() => String, { description: 'User hashed password' })
  password: string;
  @Prop()
  hashed_rt: string | null;
  @Prop()
  @Field(() => Boolean, { description: 'User isArchived ', nullable: true })
  isArchived: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
