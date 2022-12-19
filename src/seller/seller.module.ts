import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerResolver } from './seller.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Seller, SellerSchema } from './entities/seller.entity';
import { UserSchema } from '../users/entities/user.entity';
import { CommonModule } from '../common/common.module';
import { AuthService } from 'src/common/auth/services/auth.service';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Seller.name,
        schema: SellerSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [SellerResolver, SellerService, UsersService],
  exports: [SellerService],
})
export class SellerModule {}
