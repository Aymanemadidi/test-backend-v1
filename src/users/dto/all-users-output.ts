import { Seller } from 'src/seller/entities/seller.entity';
import { User } from '../entities/user.entity';
import { InputType, Field, PartialType, ObjectType } from '@nestjs/graphql';
import { Buyer } from 'src/buyer/entities/buyer.entity';

@ObjectType()
export class AllUsersOutput extends PartialType(User) {
  @Field(() => Seller, { nullable: true })
  seller: Seller;
  @Field(() => Buyer, { nullable: true })
  buyer: Buyer;
}
