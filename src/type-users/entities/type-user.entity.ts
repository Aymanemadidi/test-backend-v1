import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';


@Schema()
@ObjectType()
export class TypeUser {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
  @Prop()
  @Field(() => String, { description: 'Libelle type utilisateur' })
  libelle: string;
  @Prop()
  @Field(() => Boolean, { description: 'utilisé pour vendeur', defaultValue: false, })
  for_seller: boolean;
  @Prop()
  @Field(() => Boolean, { description: 'utilisé pour acheteur', defaultValue: false,})
  for_buyer: boolean;
  @Prop()
  @Field(() => String, { description: 'Description type utilisateur' })
  description: string;
  @Prop()
  @Field(() => Date, { description: 'TypeUser created_at ', nullable: true })
  created_at: Date;
}
export const TypeUserSchema = SchemaFactory.createForClass(TypeUser);
