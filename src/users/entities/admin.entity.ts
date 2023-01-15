import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../roles/enums/role.enum';
import { User } from './user.entity';
@Schema()
@ObjectType()
export class Admin extends User {
  // @Prop()
  // @Field(() => Boolean)
  // statut: boolean;
}
