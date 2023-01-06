import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { MongoModule } from './mongo.module';
import { ConfigModule } from './config.module';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, MongoModule, GraphqlModule, AuthModule, JwtModule],
  exports: [ConfigModule, MongoModule, GraphqlModule, AuthModule, JwtModule],
})
export class CommonModule {}
