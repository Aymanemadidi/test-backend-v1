import { InputType, Int, Field } from '@nestjs/graphql';
import { Role } from '../../roles/enums/role.enum';
import { TypeVendeur, TypeCompte } from '../../enums';
import { Schema as MongooseSchema } from 'mongoose';
import { StatutBuyer } from '../entities/buyer.entity';

@InputType()
export class CreateBuyerInput {
  @Field(() => String, { description: 'Buyer firstName ' })
  firstName: string;
  @Field(() => String, { description: 'Buyer lastName ' })
  lastName: string;
  @Field(() => String, { description: 'Buyer email ' })
  email: string;
  @Field(() => String, { description: 'Buyer date of birth ' })
  dateOfBirth: string;
  @Field(() => String, { description: 'Buyer nationality ', nullable: true })
  nationality: string;
  @Field(() => String, { description: 'Buyer country of residence  ' })
  countryOfResidency: string;
  @Field(() => Number, { description: 'Buyer mobile number ' })
  mobileNumber: number;
  @Field(() => Number, { description: 'Buyer fix number ' })
  fixNumber: number;
  @Field(() => String, { description: 'Buyer role' })
  role: Role;
  @Field(() => Int, { description: 'Buyer Siret number ' })
  numeroSiret: number;
  @Field(() => String, { description: 'Buyer nomEntreprise ' })
  nomEntreprise: string;
  @Field(() => String, { description: 'Buyer typeCompte ', nullable: true })
  typeCompte: TypeCompte;
  @Field(() => String, { description: 'Buyer adresse ' })
  adresse: string;
  @Field(() => String, { description: 'Buyer company adresse ' })
  companyAdresse: string;
  @Field(() => String, { description: 'Buyer code postal ' })
  codePostal: string;
  @Field(() => String, { description: 'Buyer company code postal ' })
  companyCodePostal: string;
  @Field(() => String, { description: 'Buyer ville ' })
  ville: string;
  @Field(() => String, { description: 'Buyer company ville ' })
  companyVille: string;
  @Field(() => String, { description: 'Buyer pays ' })
  pays: string;
  @Field(() => String, { description: 'Buyer company pays ' })
  companyPays: string;
  @Field(() => String, { description: 'Buyer website ', nullable: true })
  website: string;
  @Field(() => String, { description: 'Seller departement ' })
  departement: string;
  @Field(() => String, { description: 'Seller civilite ' })
  civilite: string;
  @Field(() => String, { description: 'Seller TVA intra ' })
  tvaIntra: string;
  userId: MongooseSchema.Types.ObjectId;
  @Field(() => String, { description: 'User hashed password' })
  password: string;
  created_at: Date;
  // @Field(() => Number)
  last_connected: Date;
  // @Field(() => Number)
  // time_connected: number;
  // @Field(() => Boolean)
  isConnected: boolean;
  // @Field(() => String)
  pseudo: string;
  @Field(() => String)
  statut: StatutBuyer;
}
