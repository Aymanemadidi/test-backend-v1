import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './roles/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CommonModule, UsersModule, PassportModule],
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
