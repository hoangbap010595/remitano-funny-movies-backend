import { GraphQLModule } from '@nestjs/graphql';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';
import { GqlConfigService } from './gql-config.service';
import { KeycloakConfigService } from './kc-config.service';
import { BullConfigService } from './queue-config.service';
import config from 'src/common/configs/config';
import { RFMGatewayModule } from 'src/gateway/gateway.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    KeycloakConnectModule.registerAsync({
      useClass: KeycloakConfigService,
    }),

    RFMGatewayModule,
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),

    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    // Will return a 401 unauthorized when it is unable to
    // verify the JWT token or Bearer header is missing.
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },

    // Will return an exception when errors
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
  ],
})
export class AppModule {}
