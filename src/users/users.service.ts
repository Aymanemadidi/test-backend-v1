import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { User } from './entities/user.entity';
import { AuthService } from '../common/services/auth.service';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
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
    return finalUser.save();
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
      return this.authService.generateUserCredentials(user);
    }
  }
}
