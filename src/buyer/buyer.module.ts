import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerResolver } from './buyer.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Buyer, BuyerSchema } from './entities/buyer.entity';
import { UserSchema } from 'src/users/entities/user.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthService } from 'src/common/auth/services/auth.service';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

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
  providers: [BuyerResolver, BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
