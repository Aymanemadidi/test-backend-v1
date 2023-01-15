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
        origin: `${
          process.env.NODE_ENV === 'production'
            ? process.env.FRONTEND_URI
            : 'http://localhost:5000'
        }`,
        credentials: true,
      },
    }),
  ],
})
export class GraphqlModule {}
