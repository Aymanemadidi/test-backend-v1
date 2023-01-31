import { ObjectType, Field, Int, createUnionType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export enum StatutCategory {
  ACTIF = 'actif',
  INACTIF = 'inactif',
  HIDDEN = 'hidden',
}

@Schema()
@ObjectType()
export class Category {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
  @Prop()
  @Field(() => String, { description: 'Nom category' })
  name: string;
  @Prop()
  @Field(() => String, { description: 'Description category' })
  description: string;
  @Prop()
  @Field(() => Date, {
    description: 'category created_at ',
    nullable: true,
  })
  created_at: Date;
  @Prop()
  @Field(() => String, {
    nullable: true,
    defaultValue: StatutCategory.ACTIF,
  })
  statut: StatutCategory;
  @Prop()
  @Field(() => String, {
    description: 'category parent ',
    nullable: true,
  })
  parent: MongooseSchema.Types.ObjectId;
  @Prop()
  @Field(() => [String], {
    description: 'subcategories of the category',
    nullable: true,
  })
  subCategories: [MongooseSchema.Types.ObjectId];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
