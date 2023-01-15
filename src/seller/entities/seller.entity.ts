import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../roles/enums/role.enum';
import { TypeVendeur, TypeCompte } from '../../enums';

export enum StatutSeller {
  ACTIF = 'actif',
  ATTENTE = 'attente',
  INACTIF = 'inactif',
  NEW = 'new',
}

@Schema()
@ObjectType()
export class Seller {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
  @Prop()
  @Field(() => String, { description: 'Seller userId ', nullable: true })
  userId: MongooseSchema.Types.ObjectId;
  @Prop()
  @Field(() => String, { description: 'Seller firstName ' })
  firstName: string;
  @Prop()
  @Field(() => String, { description: 'Seller lastName ' })
  lastName: string;
  @Prop()
  @Field(() => String, { description: 'Seller email ' })
  email: string;
  @Prop()
  @Field(() => String, { description: 'Seller date of birth ' })
  dateOfBirth: string;
  @Prop()
  @Field(() => String, { description: 'Seller nationality ', nullable: true })
  nationality: string;
  @Prop()
  @Field(() => String, { description: 'Seller country of residence  ' })
  countryOfResidency: string;
  @Prop()
  @Field(() => String, { description: 'Seller mobile number ' })
  mobileNumber: string;
  @Prop()
  @Field(() => String, { description: 'Seller fix number ' })
  fixNumber: string;
  @Prop()
  @Field(() => String, { description: 'Seller role' })
  role: Role;
  @Prop()
  @Field(() => Number, { description: 'Seller Siret number ' })
  numeroSiret: number;
  @Prop()
  @Field(() => String, { description: 'Seller nomEntreprise ' })
  nomEntreprise: string;
  @Prop()
  @Field(() => String, { description: 'Seller type ', nullable: true })
  typeVendeur: TypeVendeur;
  @Prop()
  @Field(() => String, { description: 'Seller groupe ', nullable: true })
  groupe: string;
  @Prop()
  @Field(() => String, { description: 'Seller typeCompte ', nullable: true })
  typeCompte: TypeCompte;
  @Prop()
  @Field(() => String, { description: 'Seller statutLegal ', nullable: true })
  statutLegal: string;
  @Prop()
  @Field(() => String, { description: 'Seller codeNAF ', nullable: true })
  codeNAF: string;
  @Prop()
  @Field(() => String, { description: 'Seller adresse ' })
  adresse: string;
  @Prop()
  @Field(() => String, { description: 'Seller Company adresse ' })
  companyAdresse: string;
  @Prop()
  @Field(() => String, { description: 'Seller legal adresse ', nullable: true })
  legalAdresse: string;
  @Prop()
  @Field(() => String, {
    description: 'Seller refund adresse ',
    nullable: true,
  })
  refundAdresse: string;
  @Prop()
  @Field(() => String, { description: 'Seller number of employees ' })
  numberOfEmployees: string;
  @Prop()
  @Field(() => String, { description: 'Seller civilite ' })
  civilite: string;
  @Prop()
  @Field(() => String, { description: 'Seller TVA intra ' })
  tvaIntra: string;
  @Prop()
  @Field(() => String, { description: 'Seller codePostal ' })
  codePostal: string;
  @Prop()
  @Field(() => String, { description: 'Seller company codePostal ' })
  companyCodePostal: string;
  @Prop()
  @Field(() => String, { description: 'Seller ville ' })
  ville: string;
  @Prop()
  @Field(() => String, { description: 'Seller Company ville ' })
  companyVille: string;
  @Prop()
  @Prop()
  @Field(() => String, { description: 'Seller pays ' })
  pays: string;
  @Prop()
  @Field(() => String, { description: 'Seller pays ' })
  companyPays: string;
  @Prop()
  @Field(() => String, { description: 'Seller IBAN ', nullable: true })
  IBAN: string;
  @Field(() => String, { description: 'Seller departement ', nullable: true })
  departement: string;
  @Prop()
  @Field(() => String, { description: 'Seller website ', nullable: true })
  website: string;
  @Prop()
  @Field(() => String, { description: 'Seller logo ', nullable: true })
  logo: string;
  @Prop()
  // @Field(() => String, { description: 'User hashed password' })
  password: string;
  @Prop()
  @Field(() => Date, { description: 'Seller created_at ', nullable: true })
  created_at: Date;
  @Prop()
  last_connected: Date;
  @Prop()
  time_connected: string;
  @Prop()
  isConnected: boolean;
  @Prop()
  @Field(() => String, { description: 'Seller Pseudo ', nullable: true })
  pseudo: string;
  @Prop()
  isPro: boolean;
  @Prop()
  @Field(() => Boolean, {
    description: 'Statut moderation seller',
    nullable: true,
  })
  statut_moderation: boolean;
  @Prop()
  @Field(() => String, { nullable: true })
  statut: StatutSeller;
  @Prop()
  @Field(() => Boolean, {
    description: 'Seller verified status ',
    nullable: true,
  })
  verified: boolean;
  @Prop()
  @Field(() => Boolean, { nullable: true })
  isArchived: boolean;
}

export const SellerSchema = SchemaFactory.createForClass(Seller);
