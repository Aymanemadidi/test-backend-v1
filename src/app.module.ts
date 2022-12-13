import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [CommonModule, UsersModule, PassportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
