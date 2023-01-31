import {
  ObjectType,
  Field,
  Int,
  createUnionType,
  PartialType,
} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.entity';

export enum StatutCategory {
  ACTIF = 'actif',
  INACTIF = 'inactif',
  HIDDEN = 'hidden',
}

@Schema()
@ObjectType()
export class CategoryAgr extends PartialType(Category) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
  @Prop()
  @Field(() => [CategoryAgr])
  sub: [CategoryAgr];
}
