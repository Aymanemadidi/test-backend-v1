import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBuyerInput } from './dto/create-buyer.input';
import { UpdateBuyerInput } from './dto/update-buyer.input';
import { LoginBuyerInput } from './dto/login-buyer.input';
import { Buyer } from './entities/buyer.entity';
import { AuthService } from '../common/auth/services/auth.service';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BuyerService {
  constructor(
    @InjectModel(Buyer.name)
    private readonly buyerModel: Model<Buyer>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}
  async create(createBuyerInput: CreateBuyerInput) {
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
    createBuyerInput.userId = buyerUser._id;
    const finalUser = new this.buyerModel(createBuyerInput);
    return finalUser.save();
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
    const user = await this.buyerModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`Buyer ${id} not found!`);
    }
    return user;
  }

  async update(id: number, updateBuyerInput: UpdateBuyerInput): Promise<Buyer> {
    const existingUser = await this.buyerModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateBuyerInput },
      { new: true },
    );

    if (!existingUser) {
      throw new NotFoundException(`Buyer ${id} not found!`);
    }
    return existingUser;
  }

  async remove(id: string) {
    const user = await this.buyerModel.findOne({ _id: id }).exec();
    return user.remove();
  }

  async loginBuyer(loginBuyerInput: LoginBuyerInput) {
    const user = await this.authService.validateUser(
      loginBuyerInput.email,
      loginBuyerInput.password,
    );
    if (!user) {
      throw new BadRequestException(`Email or password are invalid`);
    } else {
      return this.authService.generateUserCredentials(user);
    }
  }
}
