import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBuyerInput } from './dto/create-buyer.input';
import { UpdateBuyerInput } from './dto/update-buyer.input';
import { LoginBuyerInput } from './dto/login-buyer.input';
import { Buyer, StatutBuyer } from './entities/buyer.entity';
import { AuthService } from '../common/auth/services/auth.service';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoggedBuyerOutput } from './dto/loged-buyer.output';
import { serialize } from 'cookie';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BuyerService {
  constructor(
    @InjectModel(Buyer.name)
    private readonly buyerModel: Model<Buyer>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createBuyerInput: CreateBuyerInput): Promise<Buyer> {
    const user = await this.userModel
      .findOne({ email: createBuyerInput.email })
      .exec();
    if (user) {
      throw new BadRequestException('This Email already exists');
    }
    // const buyer = await this.buyerModel
    //   .findOne({ email: createBuyerInput.email })
    //   .exec();
    // if (buyer) {
    //   throw new BadRequestException('This Email already exists');
    // }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createBuyerInput.password, saltOrRounds);
    createBuyerInput.password = hash;
    const buyerUser = new this.userModel(createBuyerInput);
    buyerUser.save();
    const d = new Date();
    const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    createBuyerInput.created_at = new Date(currentDate);
    createBuyerInput.last_connected = new Date(currentDate);
    createBuyerInput.isConnected = true;
    createBuyerInput.statut = StatutBuyer.NEW;
    createBuyerInput.userId = buyerUser._id;
    const finalUser = new this.buyerModel(createBuyerInput);
    finalUser.save();
    const tokens = await this.authService.generateUserCredentials(buyerUser);
    await this.usersService.updateRtHash(buyerUser.id, tokens.refresh_token);
    return finalUser;
  }

  findAll() {
    return this.buyerModel.find().exec();
  }

  async findBuyerByEmail(email: string): Promise<Buyer> {
    const user = await this.buyerModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`Buyer not found!`);
    }
    return user;
  }

  async findOne(id: string): Promise<Buyer> {
    const user = await this.buyerModel.findOne({ userId: id }).exec();
    if (!user) {
      throw new NotFoundException(`Buyer ${id} not found!`);
    }
    return user;
  }

  async update(id: string, updateBuyerInput: UpdateBuyerInput): Promise<Buyer> {
    const updatedBuyer = await this.buyerModel.findOneAndUpdate(
      { userId: id },
      { $set: updateBuyerInput },
      { new: true },
    );

    if (!updatedBuyer) {
      throw new NotFoundException(`Buyer ${id} not found!`);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateBuyerInput },
      { new: true },
    );
    return updatedBuyer;
  }

  async remove(id: string) {
    const user = await this.buyerModel.findOne({ userId: id }).exec();
    if (!user) {
      throw new NotFoundException();
    }
    const buyerUserId = user.userId;
    this.usersService.remove(buyerUserId.toString());
    user.remove();
    return true;
  }

  async loginBuyer(loginBuyerInput: LoginBuyerInput, ctx: any) {
    const user = await this.authService.validateUser(
      loginBuyerInput.email,
      loginBuyerInput.password,
    );
    if (!user) {
      throw new BadRequestException(`Email or password are invalid`);
    } else {
      const buyer = await this.buyerModel.findOne({
        email: loginBuyerInput.email,
      });
      buyer.last_connected = new Date();
      buyer.save();
      const tokens = await this.authService.generateUserCredentials(user);
      const serialisedA = serialize('access_token', tokens.access_token, {
        httpOnly: false, //maybe disabling this to be able to send it in authorization header
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
      const serialisedR = serialize('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
      ctx.res.setHeader('Set-Cookie', [serialisedA, serialisedR]);
      ctx.res.setHeader('Access-Control-Allow-Credentials', 'true');
      await this.usersService.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    }
  }

  async logout(ctx: any) {
    const at = ctx.req.cookies['access_token'];
    if (!at) {
      throw new NotFoundException();
    }
    const payload = this.jwtService.decode(at);
    if (!payload) {
      throw new NotFoundException();
    }
    const id = payload.sub;
    const buyer = await this.buyerModel.findOne({
      userId: id,
    });
    const lastConn = buyer.last_connected;
    const today = new Date();
    const diffMs = today.getTime() - buyer.last_connected.getTime();
    const diffMins = Math.round(
      (((Number(today) - Number(lastConn)) % 86400000) % 3600000) / 60000,
    );
    const totalMinutes = diffMins;
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const minutes = Math.trunc(totalMinutes % 60);
    buyer.time_connected = `${diffHrs}h${minutes}min`;
    buyer.save();
    return this.usersService.logout(ctx);
  }
}
