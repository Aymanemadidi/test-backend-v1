import { InputType, Int, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Nom category' })
  name: string;
  @Field(() => String, { description: 'Description category' })
  description: string;
  @Field(() => Date, {
    description: 'category created_at ',
    nullable: true,
  })
  created_at: Date;
  // @Field(() => String, {
  //   nullable: true,
  //   defaultValue: StatutCategory.ACTIF,
  // })
  // statut: StatutCategory;
  @Field(() => String, {
    description: 'category parent ',
    nullable: true,
  })
  parent: MongooseSchema.Types.ObjectId | null;
  @Field(() => [String], {
    description: 'subcategories of the category',
    nullable: true,
  })
  subCategories: [MongooseSchema.Types.ObjectId];
}
