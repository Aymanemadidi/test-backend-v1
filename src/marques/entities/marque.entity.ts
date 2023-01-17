
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


export enum StatutMarque {
  NEW = 'new',
  ACTIF = 'actif',
}

@Schema()
@ObjectType()
export class Marque {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
  @Prop()
  @Field(() => String, { description: 'Libelle Marque' })
  libelle: string;
  @Prop()
  @Field(() => Date, { description: 'Marque created_at ', nullable: true })
  created_at: Date;
  @Prop()
  @Field(() => String, {  nullable: true  })
  statut: StatutMarque;
}
export const MarqueSchema = SchemaFactory.createForClass(Marque);