import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Schema as MongooseSchema } from 'mongoose';

export enum StatutModePaiement {
 
  ACTIF = 'actif',
  INACTIF = 'inactif',
}
@Schema()
@ObjectType()
export class ModesPaiement {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
  @Prop()
  @Field(() => String, { description: 'Mode de paiement' })
  mode_paiement: string;
  @Prop()
  @Field(() => String, { description: 'Description Mode de paiement' })
  description: string;
  @Prop()
  @Field(() => Date, { description: 'ModesPaiement created_at ', nullable: true })
  created_at: Date;
  @Prop()
  @Field(() => String, {  nullable: true, defaultValue: StatutModePaiement.INACTIF })
  statut: StatutModePaiement;
}
export const ModesPaiementSchema = SchemaFactory.createForClass(ModesPaiement);