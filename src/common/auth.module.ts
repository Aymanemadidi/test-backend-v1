import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { AuthService } from './auth/services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './auth/services/jwt.strategy';
import { Jwt_Rt_Strategy } from './auth/services/jwt_rt.strategy';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    JwtModule.register({}),
  ],
  providers: [AuthService, JwtStrategy, Jwt_Rt_Strategy],
  exports: [AuthService],
})
export class AuthModule {}

// @Module({
//   imports: [
//     ConfigModule,
//     forwardRef(() => UsersModule),
//     JwtModule.registerAsync({
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_AT_SECRET'),
//         signOptions: { expiresIn: '10000s' },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [AuthService, JwtStrategy],
//   exports: [AuthService],
// })
// export class AuthModule {}
