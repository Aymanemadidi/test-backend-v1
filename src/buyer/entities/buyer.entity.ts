import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../roles/enums/role.enum';
import { TypeVendeur, TypeCompte, Civilite } from '../../enums';

export enum StatutBuyer {
  ACTIF = 'actif',
  INACTIF = 'inactif',
  NEW = 'new',
}

@Schema()
@ObjectType()
export class Buyer {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
  @Prop()
  userId: MongooseSchema.Types.ObjectId;
  @Prop()
  @Field(() => String, { description: 'Buyer firstName ' })
  firstName: string;
  @Prop()
  @Field(() => String, { description: 'Buyer lastName ' })
  lastName: string;
  @Prop()
  @Field(() => String, { description: 'Buyer date of birth ' })
  dateOfBirth: string;
  @Prop()
  @Field(() => String, { description: 'Buyer nationality ', nullable: true })
  nationality: string;
  @Prop()
  @Field(() => String, { description: 'Buyer country of residence  ' })
  countryOfResidency: string;
  @Prop()
  @Field(() => Number, { description: 'Buyer mobile number ' })
  mobileNumber: number;
  @Prop()
  @Field(() => Number, { description: 'Buyer fix number ' })
  fixNumber: number;
  @Prop()
  @Field(() => String, { description: 'Buyer website ', nullable: true })
  website: string;
  @Prop()
  @Field(() => String, { description: 'Buyer email ' })
  email: string;
  @Prop()
  @Field(() => String, { description: 'Buyer role' })
  role: Role;
  @Prop()
  @Field(() => String, { description: 'Buyer nomEntreprise ' })
  nomEntreprise: string;
  @Prop()
  @Field(() => Int, { description: 'Buyer Siret number ' })
  numeroSiret: number;
  @Prop()
  @Field(() => String, { description: 'Buyer typeCompte ', nullable: true })
  typeCompte: TypeCompte;
  @Prop()
  @Field(() => String, { description: 'Buyer civilite ', nullable: true })
  civilite: Civilite;
  @Prop()
  // @Field(() => String, { description: 'User hashed password' })
  password: string;
  @Prop()
  created_at: Date;
  @Prop()
  last_connected: Date;
  @Prop()
  time_connected: string;
  @Prop()
  isConnected: boolean;
  @Prop()
  @Field(() => String, { description: 'Buyer Pseudo ', nullable: true })
  pseudo: string;
  @Prop()
  statut: StatutBuyer;
}

export const BuyerSchema = SchemaFactory.createForClass(Buyer);
