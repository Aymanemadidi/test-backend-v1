import {
  BadRequestException,
  ForbiddenException,
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
import { serialize } from 'cookie';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller.name)
    private readonly sellerModel: Model<Seller>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async create(
    createSellerInput: CreateSellerInput,
    ctx: any,
  ): Promise<Seller> {
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
    // const d = new Date();
    // const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    createSellerInput.created_at = new Date();
    createSellerInput.last_connected = new Date();
    createSellerInput.isConnected = true;
    createSellerInput.isPro = false;
    createSellerInput.statut_moderation = false;
    createSellerInput.statut = StatutSeller.NEW;
    createSellerInput.userId = sellerUser._id;
    const pseudo = `${createSellerInput.nomEntreprise.slice(
      0,
      3,
    )}${createSellerInput.ville.slice(
      0,
      2,
    )}${createSellerInput.codePostal.slice(0, 2)}${createSellerInput.pays.slice(
      0,
      2,
    )}`;
    createSellerInput.pseudo = pseudo.toUpperCase();
    console.log('pseudo: ', createSellerInput.pseudo);
    const finalUser = new this.sellerModel(createSellerInput);
    finalUser.save();
    const tokens = await this.authService.generateUserCredentials(sellerUser);
    const serialisedA = serialize('access_token', tokens.access_token, {
      httpOnly: true, //maybe disabling this to be able to send it in authorization header
      secure: true,
      sameSite: 'none',
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
    console.log(process.env.FRONTEND_URI);
    ctx.res.setHeader('Set-Cookie', [serialisedA, serialisedR]);
    ctx.res.setHeader(
      'Access-Control-Allow-Origin',
      `${
        process.env.NODE_ENV === 'production'
          ? process.env.FRONTEND_URI
          : 'http://localhost:5000'
      }`,
    );
    await this.usersService.updateRtHash(sellerUser.id, tokens.refresh_token);
    return finalUser;
  }

  async createByAdm(createSellerInput: CreateSellerInput): Promise<Seller> {
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
    // const d = new Date();
    // const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    createSellerInput.created_at = new Date();
    createSellerInput.last_connected = new Date();
    createSellerInput.isConnected = true;
    createSellerInput.isPro = false;
    createSellerInput.statut_moderation = false;
    createSellerInput.statut = StatutSeller.NEW;
    createSellerInput.userId = sellerUser._id;
    const pseudo = `${createSellerInput.nomEntreprise.slice(
      0,
      3,
    )}${createSellerInput.ville.slice(
      0,
      2,
    )}${createSellerInput.codePostal.slice(0, 2)}${createSellerInput.pays.slice(
      0,
      2,
    )}`;
    createSellerInput.pseudo = pseudo.toUpperCase();
    console.log('pseudo: ', createSellerInput.pseudo);
    const finalUser = new this.sellerModel(createSellerInput);
    finalUser.save();
    const tokens = await this.authService.generateUserCredentials(sellerUser);
    await this.usersService.updateRtHash(sellerUser.id, tokens.refresh_token);
    return finalUser;
  }

  findAllWithOccurence(
    email: string,
    nomEntreprise: string,
    pseudo: string,
    startDate: string,
    endDate: string,
  ) {
    console.log('startDate: ', startDate);
    console.log('endDate: ', endDate);
    let sd = new Date(0);
    let ed = new Date();
    const e = email;
    const n = nomEntreprise;
    const p = pseudo;
    if (startDate !== '') {
      sd = new Date(startDate);
    }
    if (endDate !== '') {
      ed = new Date(endDate);
    }
    const regex = new RegExp(e, 'i'); // i for case insensitive
    const regexn = new RegExp(n, 'i'); // i for case insensitive
    const regexp = new RegExp(p, 'i'); // i for case insensitive

    return this.sellerModel.find({
      email: { $regex: regex },
      nomEntreprise: { $regex: regexn },
      pseudo: { $regex: regexp },
      created_at: { $gte: sd, $lt: ed },
    });
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
    const user = await this.sellerModel.findOne({ userId: id }).exec();
    if (!user) {
      throw new NotFoundException(`Seller ${id} not found!`);
    }
    return user;
  }

  async update(
    id: string,
    updateSellerInput: UpdateSellerInput,
  ): Promise<Seller> {
    console.log('updatedSellerInput: ', updateSellerInput);
    const sellerFound = await this.sellerModel.findOne({ userId: id });
    const saltOrRounds = 10;
    if (updateSellerInput.password) {
      const hash = await bcrypt.hash(updateSellerInput.password, saltOrRounds);
      updateSellerInput.password = hash;
    }
    if (sellerFound.statut_moderation === false && updateSellerInput.statut) {
      throw new ForbiddenException(
        'cannot update status of unmoderated seller',
      );
    }
    const updatedSeller = await this.sellerModel.findOneAndUpdate(
      { userId: id },
      { $set: updateSellerInput },
      { new: true },
    );

    // const updatesForUser:User = {};
    // if (updateSellerInput.email) {
    //   updatesForUser.email =
    // }

    if (!updatedSeller) {
      throw new NotFoundException(`Seller ${id} not found!`);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateSellerInput },
      { new: true },
    );
    return updatedSeller;
  }

  async remove(id: string) {
    const user = await this.sellerModel.findOne({ userId: id }).exec();
    if (!user) {
      throw new NotFoundException();
    }
    const sellerUserId = user.userId;
    this.usersService.remove(sellerUserId.toString());
    user.remove();
    return true;
  }

  async loginSeller(loginSellerInput: LoginSellerInput, ctx: any) {
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
      seller.last_connected = new Date();
      seller.save();
      const tokens = await this.authService.generateUserCredentials(user);
      const serialisedA = serialize('access_token', tokens.access_token, {
        httpOnly: true, //maybe disabling this to be able to send it in authorization header
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
      ctx.res.setHeader(
        'Access-Control-Allow-Origin',
        `${
          process.env.NODE_ENV === 'production'
            ? process.env.FRONTEND_URI
            : 'http://localhost:5000'
        }`,
      );
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
    const seller = await this.sellerModel.findOne({
      userId: id,
    });
    const lastConn = seller.last_connected;
    const today = new Date();
    const diffMs = today.getTime() - seller.last_connected.getTime();
    const diffMins = Math.round(
      (((Number(today) - Number(lastConn)) % 86400000) % 3600000) / 60000,
    );
    const totalMinutes = diffMins;
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const minutes = Math.trunc(totalMinutes % 60);
    seller.time_connected = `${diffHrs}h${minutes}min`;
    seller.save();
    return this.usersService.logout(ctx);
  }
}
