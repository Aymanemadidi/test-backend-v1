import { InputType, Int, Field } from '@nestjs/graphql';
import { Role } from '../../roles/enums/role.enum';
import { TypeVendeur, TypeCompte } from '../../enums';
import { StatutSeller } from '../entities/seller.entity';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class CreateSellerInput {
  @Field(() => String, { description: 'Seller firstName ' })
  firstName: string;
  @Field(() => String, { description: 'Seller lastName ' })
  lastName: string;
  @Field(() => String, { description: 'Seller email ' })
  email: string;
  @Field(() => String, { description: 'Seller date of birth ' })
  dateOfBirth: string;
  @Field(() => String, { description: 'Seller nationality ', nullable: true })
  nationality: string;
  @Field(() => String, { description: 'Seller country of residence  ' })
  countryOfResidency: string;
  @Field(() => Number, { description: 'Seller mobile number ' })
  mobileNumber: number;
  @Field(() => Number, { description: 'Seller fix number ' })
  fixNumber: number;
  @Field(() => String, { description: 'Seller role' })
  role: Role;
  @Field(() => Int, { description: 'Seller Siret number ' })
  numeroSiret: number;
  @Field(() => String, { description: 'Seller nomEntreprise ' })
  nomEntreprise: string;
  @Field(() => String, { description: 'Seller type ', nullable: true })
  typeVendeur: TypeVendeur;
  @Field(() => String, { description: 'Seller groupe ', nullable: true })
  groupe: string;
  @Field(() => String, { description: 'Seller typeCompte ', nullable: true })
  typeCompte: TypeCompte;
  @Field(() => String, { description: 'Seller statutLegal ', nullable: true })
  statutLegal: string;
  @Field(() => String, { description: 'Seller codeNAF ', nullable: true })
  codeNAF: string;
  @Field(() => String, { description: 'Seller adresse ' })
  adresse: string;
  @Field(() => String, { description: 'Seller company adresse ' })
  companyAdresse: string;
  @Field(() => String, { description: 'Seller number of employees ' })
  numberOfEmployees: string;
  @Field(() => String, { description: 'Seller civilite ' })
  civilite: string;
  @Field(() => String, { description: 'Seller TVA intra ' })
  tvaIntra: string;
  @Field(() => String, { description: 'Seller codePostal ' })
  codePostal: string;
  @Field(() => String, { description: 'Seller ville ' })
  ville: string;
  @Field(() => String, { description: 'Seller departement ' })
  departement: string;
  @Field(() => String, { description: 'Seller pays ' })
  pays: string;
  @Field(() => String, { description: 'Seller IBAN ', nullable: true })
  IBAN: string;
  @Field(() => String, { description: 'Seller website ', nullable: true })
  website: string;
  userId: MongooseSchema.Types.ObjectId;
  @Field(() => String, { description: 'Seller logo ', nullable: true })
  logo: string;
  @Field(() => String, { description: 'User hashed password' })
  password: string;
  // @Field(() => Number)
  created_at: Date;
  // @Field(() => Number)
  last_connected: Date;
  // @Field(() => Number)
  // time_connected: number;
  // @Field(() => Boolean)
  isConnected: boolean;
  // @Field(() => String)
  pseudo: string;
  // @Field(() => Boolean)
  isPro: boolean;
  @Field(() => Boolean)
  statut_moderation: boolean;
  @Field(() => String)
  statut: StatutSeller;
  @Field(() => Boolean)
  isArchived: boolean;
}
