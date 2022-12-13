import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { MongoModule } from './mongo.module';
import { ConfigModule } from './config.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [ConfigModule, MongoModule, GraphqlModule, AuthModule],
  exports: [ConfigModule, MongoModule, GraphqlModule, AuthModule],
})
export class CommonModule {}
