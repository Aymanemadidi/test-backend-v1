import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { User } from './entities/user.entity';
import { AuthService } from '../common/auth/services/auth.service';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
// import { CreateSellerInput } from 'src/seller/dto/create-seller.input';
// import { UpdateSellerInput } from 'src/seller/dto/update-seller.input';
import * as argon from 'argon2';
import { Tokens } from '../common/auth/types';
import { BuyerService } from '../buyer/buyer.service';
import { SellerService } from '../seller/seller.service';
import { Buyer } from '../buyer/entities/buyer.entity';
import { Seller } from '../seller/entities/seller.entity';
import { serialize } from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Buyer.name)
    private readonly buyerModel: Model<Buyer>,
    @InjectModel(Seller.name)
    private readonly sellerModel: Model<Seller>,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async create(createUserInput: CreateUserInput) {
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
    return finalUser;
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
    // console.log(typeof id);
    // const _id = new mongoose.Types.ObjectId(id);
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`User ${id} not found!`);
    }
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
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
    if (!user) {
      throw new NotFoundException();
    }
    console.log(user);
    if (user.role === 'Buyer') {
      const buyer = await this.buyerModel.findOne({ userId: id }).exec();
      console.log(buyer);
      buyer.remove();
    } else if (user.role === 'Seller') {
      const seller = await this.sellerModel.findOne({ userId: id }).exec();
      seller.remove();
    }
    user.remove();
    return true;
  }

  async loginUser(loginUserInput: LoginUserInput, ctx: any) {
    const user = await this.authService.validateUser(
      loginUserInput.email,
      loginUserInput.password,
    );
    if (!user) {
      throw new BadRequestException(`Email or password are invalid`);
    } else {
      const user = await this.userModel.findOne({
        email: loginUserInput.email,
      });
      if (user.role === 'Seller') {
        const seller = await this.sellerModel.findOne({
          email: loginUserInput.email,
        });
        seller.last_connected = new Date();
        seller.save();
      } else if (user.role === 'Buyer') {
        const buyer = await this.buyerModel.findOne({
          email: loginUserInput.email,
        });
        buyer.last_connected = new Date();
        buyer.save();
      }
      const tokens = await this.authService.generateUserCredentials(user);
      const serialisedA = serialize('access_token', tokens.access_token, {
        httpOnly: true, //maybe disabling this to be able to send it in authorization header
        secure: true,
        sameSite: 'none',
        // maxAge: 5 * 60,
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
      const serialisedR = serialize('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
      ctx.res.setHeader('Set-Cookie', [serialisedA, serialisedR]);
      ctx.res.set({
        'Access-Control-Allow-Origin':
          'https://frontend-test-v1-rho.vercel.app',
      });
      await this.updateRtHash(user.id, tokens.refresh_token);
      return user;
    }
  }

  async logout(ctx: any): Promise<boolean> {
    // update many to prevent spaming the logout button?
    const at = ctx.req.cookies['access_token'];
    if (!at) {
      throw new NotFoundException();
    }
    const payload = this.jwtService.decode(at);
    if (!payload) {
      throw new NotFoundException();
    }
    const userId = payload.sub;
    const user = await this.userModel.updateOne(
      { _id: userId },
      {
        hashed_rt: null,
      },
    );

    if (!user) {
      throw new NotFoundException();
    }
    ctx.res.set('Set-Cookie', [
      `access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      `refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    ]);
    return true;
  }

  async refreshTokens(id: string, rt: string): Promise<Tokens> {
    const user = await this.userModel.findOne({
      _id: id,
    });
    if (!user || !user.hashed_rt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashed_rt, rt);
    console.log('rtMatches: ', rtMatches);
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

  async getMe(ctx: any) {
    console.log(ctx.req.cookies);
    const at = ctx.req.cookies['access_token'];
    ctx.res.setHeader(
      'Access-Control-Allow-Origin',
      'https://frontend-test-v1-rho.vercel.app',
    );
    if (!at) {
      throw new NotFoundException();
    }
    const payload = this.jwtService.decode(at);
    if (!payload) {
      throw new NotFoundException();
    }
    const _id = payload.sub;
    const user = this.userModel.findOne({ _id });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
