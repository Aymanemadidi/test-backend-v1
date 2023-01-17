import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './roles/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { BuyerModule } from './buyer/buyer.module';
import { SellerModule } from './seller/seller.module';
import { MarquesModule } from './marques/marques.module';
import { TypeUsersModule } from './type-users/type-users.module';
import { ModesPaiementModule } from './modes-paiement/modes-paiement.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    PassportModule,
    BuyerModule,
    SellerModule,
    MarquesModule,
    TypeUsersModule,
    ModesPaiementModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
