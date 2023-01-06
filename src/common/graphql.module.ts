import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './schema.gql',
      playground: true,
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin:
          // process.env.NODE_ENV === 'production'
          'https://frontend-test-v1-rho.vercel.app/',
        // :
        // 'http://localhost:5000',

        credentials: true,
      },
    }),
  ],
})
export class GraphqlModule {}
