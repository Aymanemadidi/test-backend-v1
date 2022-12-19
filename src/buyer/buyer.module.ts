import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerResolver } from './buyer.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Buyer, BuyerSchema } from './entities/buyer.entity';
import { UserSchema } from '../users/entities/user.entity';
import { CommonModule } from '../common/common.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Buyer.name,
        schema: BuyerSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [BuyerResolver, BuyerService, UsersService],
  exports: [BuyerService],
})
export class BuyerModule {}
