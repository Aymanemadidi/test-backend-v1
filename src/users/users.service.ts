import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { User } from './entities/user.entity';
import { AuthService } from '../common/auth/services/auth.service';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateSellerInput } from 'src/seller/dto/create-seller.input';
import { UpdateSellerInput } from 'src/seller/dto/update-seller.input';
import * as argon from 'argon2';
import { Tokens } from 'src/common/auth/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}
  async create(createUserInput: CreateUserInput | CreateSellerInput) {
    const user = await this.userModel
      .findOne({ email: createUserInput.email })
      .exec();
    if (user) {
      throw new BadRequestException('This Email already exists');
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserInput.password, saltOrRounds);
    createUserInput.password = hash;
    const finalUser = new this.userModel(createUserInput);
    finalUser.save();
    const tokens = await this.authService.generateUserCredentials(finalUser);
    await this.updateRtHash(finalUser.id, tokens.refresh_token);
    return tokens;
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }
    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`User ${id} not found!`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput | UpdateSellerInput,
  ): Promise<User> {
    const existingUser = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateUserInput },
      { new: true },
    );

    if (!existingUser) {
      throw new NotFoundException(`User ${id} not found!`);
    }
    return existingUser;
  }

  async remove(id: string) {
    const user = await this.userModel.findOne({ _id: id }).exec();
    return user.remove();
  }

  async loginUser(loginUserInput: LoginUserInput) {
    const user = await this.authService.validateUser(
      loginUserInput.email,
      loginUserInput.password,
    );
    if (!user) {
      throw new BadRequestException(`Email or password are invalid`);
    } else {
      const tokens = await this.authService.generateUserCredentials(user);
      await this.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    }
  }

  async logout(userId: string): Promise<boolean> {
    // update many to prevent spaming the logout button?
    const user = await this.userModel.updateOne(
      { _id: userId },
      {
        hashed_rt: null,
      },
    );

    if (!user) {
      throw new NotFoundException();
    }
    return true;
  }

  async refreshTokens(id: number, rt: string): Promise<Tokens> {
    const user = await this.userModel.findOne({
      _id: id,
    });
    if (!user || !user.hashed_rt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashed_rt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      sub: user._id,
    };

    const tokens = await this.authService.getTokens(payload);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(id: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.userModel.updateOne({ _id: id }, { hashed_rt: hash });
  }

  async archive(userId: string): Promise<boolean> {
    // update many to prevent spaming the logout button?
    const user = await this.userModel.updateOne(
      { _id: userId },
      {
        isArchived: true, // TODO
      },
    );

    if (!user) {
      throw new NotFoundException();
    }
    return true;
  }
}
