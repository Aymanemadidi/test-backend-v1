import { Module } from '@nestjs/common';
import { TypeUsersService } from './type-users.service';
import { TypeUsersResolver } from './type-users.resolver';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeUser, TypeUserSchema } from './entities/type-user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: TypeUser.name,
        schema: TypeUserSchema,
      },
    ]),
  ],
  providers: [TypeUsersResolver, TypeUsersService, UsersService],
  exports: [TypeUsersService],
})
export class TypeUsersModule {}
