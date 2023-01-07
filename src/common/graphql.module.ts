import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './schema.gql',
      playground: true,
      cache: 'bounded',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: 'https://frontend-test-v1-rho.vercel.app',
        credentials: true,
      },
    }),
  ],
})
export class GraphqlModule {}
