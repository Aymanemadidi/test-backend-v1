import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
import { LoginSellerInput } from './dto/login-seller.input';
import { Seller, StatutSeller } from './entities/seller.entity';
import { AuthService } from '../common/auth/services/auth.service';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoggedSellerOutput } from './dto/loged-seller.output';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller.name)
    private readonly sellerModel: Model<Seller>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  async create(
    createSellerInput: CreateSellerInput,
  ): Promise<LoggedSellerOutput> {
    const user = await this.userModel
      .findOne({ email: createSellerInput.email })
      .exec();
    if (user) {
      throw new BadRequestException('This Email already exists');
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createSellerInput.password, saltOrRounds);
    createSellerInput.password = hash;
    const sellerUser = new this.userModel(createSellerInput);
    sellerUser.save();
    createSellerInput.created_at = Date.now();
    createSellerInput.last_connected = Date.now();
    createSellerInput.isConnected = true;
    createSellerInput.isPro = false;
    createSellerInput.statut_moderation = false;
    createSellerInput.statut = StatutSeller.NEW;
    createSellerInput.userId = sellerUser._id;
    const finalUser = new this.sellerModel(createSellerInput);
    finalUser.save();
    const tokens = await this.authService.generateUserCredentials(sellerUser);
    await this.usersService.updateRtHash(sellerUser.id, tokens.refresh_token);
    return tokens;
  }

  findAll() {
    return this.sellerModel.find().exec();
  }

  async findSellerByEmail(email: string): Promise<Seller> {
    const user = await this.sellerModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`Seller not found!`);
    }
    return user;
  }

  async findOne(id: string): Promise<Seller> {
    const user = await this.sellerModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`Seller ${id} not found!`);
    }
    return user;
  }

  async update(
    id: string,
    updateSellerInput: UpdateSellerInput,
  ): Promise<Seller> {
    const existingUser = await this.sellerModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateSellerInput },
      { new: true },
    );

    if (!existingUser) {
      throw new NotFoundException(`Seller ${id} not found!`);
    }
    return existingUser;
  }

  async remove(id: string) {
    const user = await this.sellerModel.findOne({ _id: id }).exec();
    return user.remove();
  }

  async loginSeller(loginSellerInput: LoginSellerInput) {
    const user = await this.authService.validateUser(
      loginSellerInput.email,
      loginSellerInput.password,
    );
    if (!user) {
      throw new BadRequestException(`Email or password are invalid`);
    } else {
      // const current time
      const seller = await this.sellerModel.findOne({
        email: loginSellerInput.email,
      });
      // const { last_connected, time_connected } = seller;
      seller.time_connected = Date.now() - seller.last_connected;
      seller.last_connected = Date.now();
      seller.save();
      const tokens = await this.authService.generateUserCredentials(user);
      await this.usersService.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    }
  }
}
