import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
// import { CreateSellerInput } from 'src/seller/dto/create-seller.input';
// import { UpdateSellerInput } from 'src/seller/dto/update-seller.input';
import * as argon from 'argon2';
import { Tokens } from '../common/auth/types';
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
  /*
    create(createUserInput)
    saves the user in the users collection and returns it.
  */
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
    if (finalUser.role === 'Admin') {
      finalUser.statut = 'actif';
      finalUser.created_at = new Date();
    }
    finalUser.save();
    // const tokens = await this.authService.generateUserCredentials(finalUser);
    // await this.updateRtHash(finalUser.id, tokens.refresh_token);
    return finalUser;
  }

  /*
    findAll()
    returns all users.
  */
  findAll() {
    return this.userModel.find().exec();
  }

  /*
    findAllAdmins()
    returns all admins.
  */
  async findAllAdmins() {
    try {
      const admins = await this.userModel.find({ role: 'Admin' });
      if (!admins) {
        throw new NotFoundException();
      }
      return admins;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /*
    findByEmail(email: string)
    return the user with the given email.
  */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }
    return user;
  }

  /*
    findAllWithOccurence(arguments listed below...)
    argumets of findAllWithOccurence:
      email: string
      nomEntreprise: string
      pseudo: string
      startDate: string
      endDate: string
      statut: string
      type: string

      -Filters all the users by the given args.
      -If all given fields are empty it returns all the users without filters.
      -It returns an an array containing the admins followed by the sellers followed by the buyers (see below)
      - usersOcc: [{admin1}, {admin2}, {seller1}, {buyer1},... ]
  */
  async findAllWithOccurence(
    email,
    nomEntreprise,
    pseudo,
    startDate,
    endDate,
    statut,
    type,
  ) {
    console.log('email ', email);
    console.log('nomEntreprise ', nomEntreprise);
    console.log('pseudo ', pseudo);
    console.log('startDate: ', startDate);
    console.log('endDate: ', endDate);
    console.log('statut ', statut);
    console.log('type ', type);
    if (statut === 'all') {
      statut === '';
    }
    let sd = new Date(0);
    let ed = new Date();
    const e = email;
    const n = nomEntreprise;
    const p = pseudo;
    const s = statut;
    if (startDate !== '') {
      sd = new Date(startDate);
      console.log('sd: ', sd);
    }
    if (endDate !== '') {
      const ded = new Date(endDate);
      const fed = ded.setDate(ded.getDate() + 1);
      ed = new Date(fed);
      console.log('ed: ', ed);
    }
    const regex = new RegExp(e, 'i'); // i for case insensitive
    const regexn = new RegExp(n, 'i'); // i for case insensitive
    const regexp = new RegExp(p, 'i'); // i for case insensitive
    const regexs = new RegExp(s, 'i'); // i for case insensitive

    // --------------- Search Logic Start ----------------- //

    if (type === 'admin' && statut !== '') {
      console.log("type === 'admin' && statut !== '");
      return this.userModel.find({
        email: { $regex: regex },
        nomEntreprise: { $regex: regexn },
        pseudo: { $regex: regexp },
        created_at: { $gte: sd, $lt: ed },
        statut,
        // statut: { $regex: regexs },
        role: 'Admin',
      });
    } else if (type === 'admin' && statut === '') {
      console.log("type === 'admin' && statut === ''");
      return this.userModel.find({
        email: { $regex: regex },
        nomEntreprise: { $regex: regexn },
        pseudo: { $regex: regexp },
        created_at: { $gte: sd, $lt: ed },
        statut: { $regex: regexs },
        role: 'Admin',
      });
    } else if (type === 'seller') {
      console.log("type === 'seller'");
      const sellers = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'sellers',
            localField: '_id',
            foreignField: 'userId',
            pipeline: [
              { $match: { email: regex } },
              { $match: { pseudo: regexp } },
              { $match: { nomEntreprise: regexn } },
              {
                $match: {
                  statut:
                    statut === 'inactif'
                      ? 'inactif'
                      : statut === 'actif'
                      ? 'actif'
                      : regexs,
                },
              },
              { $match: { created_at: { $gte: sd, $lt: ed } } },
              {
                $lookup: {
                  from: 'typeusers',
                  localField: 'typeCompte',
                  foreignField: '_id',
                  as: 'type',
                },
              },
              { $unwind: '$type' },
            ],
            as: 'seller',
          },
        },
        { $unwind: '$seller' },
      ]);
      return sellers;
    } else if (type === 'buyer') {
      console.log("type === 'buyer'");
      const buyers = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'buyers',
            localField: '_id',
            foreignField: 'userId',
            pipeline: [
              { $match: { email: regex } },
              { $match: { pseudo: regexp } },
              { $match: { nomEntreprise: regexn } },
              {
                $match: {
                  statut:
                    statut === 'inactif'
                      ? 'inactif'
                      : statut === 'actif'
                      ? 'actif'
                      : regexs,
                },
              },
              { $match: { created_at: { $gte: sd, $lt: ed } } },
              {
                $lookup: {
                  from: 'typeusers',
                  localField: 'typeCompte',
                  foreignField: '_id',
                  as: 'type',
                },
              },
              { $unwind: '$type' },
            ],
            as: 'buyer',
          },
        },
        { $unwind: '$buyer' },
      ]);
      return buyers;
    } else if (type === 'sellerPro') {
      console.log("type === 'sellerPro'");
      const sellers = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'sellers',
            localField: '_id',
            foreignField: 'userId',
            pipeline: [
              { $match: { isPro: true } },
              { $match: { email: regex } },
              { $match: { pseudo: regexp } },
              { $match: { nomEntreprise: regexn } },
              {
                $match: {
                  statut:
                    statut === 'inactif'
                      ? 'inactif'
                      : statut === 'actif'
                      ? 'actif'
                      : regexs,
                },
              },
              { $match: { created_at: { $gte: sd, $lt: ed } } },
              {
                $lookup: {
                  from: 'typeusers',
                  localField: 'typeCompte',
                  foreignField: '_id',
                  as: 'type',
                },
              },
              { $unwind: '$type' },
            ],
            as: 'seller',
          },
        },
        { $unwind: '$seller' },
      ]);
      return sellers;
    }

    if (
      statut !== '' &&
      pseudo === '' &&
      nomEntreprise === '' &&
      email === '' &&
      type === ''
    ) {
      console.log('statut check');
      const admins = await this.userModel.find({
        role: 'Admin',
        statut: { $regex: regexs },
      });
      const sellers = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'sellers',
            localField: '_id',
            foreignField: 'userId',
            pipeline: [
              {
                $match: {
                  statut:
                    statut === 'inactif'
                      ? 'inactif'
                      : statut === 'actif'
                      ? 'actif'
                      : regexs,
                },
              },
              { $match: { created_at: { $gte: sd, $lt: ed } } },
              {
                $lookup: {
                  from: 'typeusers',
                  localField: 'typeCompte',
                  foreignField: '_id',
                  as: 'type',
                },
              },
              { $unwind: '$type' },
            ],
            as: 'seller',
          },
        },
        { $unwind: '$seller' },
      ]);
      // console.log(sellers);
      const buyers = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'buyers',
            localField: '_id',
            foreignField: 'userId',
            pipeline: [
              {
                $match: {
                  statut:
                    statut === 'inactif'
                      ? 'inactif'
                      : statut === 'actif'
                      ? 'actif'
                      : regexs,
                },
              },
              { $match: { created_at: { $gte: sd, $lt: ed } } },
              {
                $lookup: {
                  from: 'typeusers',
                  localField: 'typeCompte',
                  foreignField: '_id',
                  as: 'type',
                },
              },
              { $unwind: '$type' },
            ],
            as: 'buyer',
          },
        },
        { $unwind: '$buyer' },
      ]);
      return [...admins, ...sellers, ...buyers];
    }

    if (pseudo !== '' || nomEntreprise !== '') {
      console.log('seller/buyer only check');
      const sellers = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'sellers',
            localField: '_id',
            foreignField: 'userId',
            pipeline: [
              { $match: { email: regex } },
              { $match: { pseudo: regexp } },
              { $match: { nomEntreprise: regexn } },
              {
                $match: {
                  statut:
                    statut === 'inactif'
                      ? 'inactif'
                      : statut === 'actif'
                      ? 'actif'
                      : regexs,
                },
              },
              { $match: { created_at: { $gte: sd, $lt: ed } } },
              {
                $lookup: {
                  from: 'typeusers',
                  localField: 'typeCompte',
                  foreignField: '_id',
                  as: 'type',
                },
              },
              { $unwind: '$type' },
            ],
            as: 'seller',
          },
        },
        { $unwind: '$seller' },
      ]);
      // console.log(sellers);
      const buyers = await this.userModel.aggregate([
        {
          $lookup: {
            from: 'buyers',
            localField: '_id',
            foreignField: 'userId',
            pipeline: [
              { $match: { email: regex } },
              { $match: { pseudo: regexp } },
              { $match: { nomEntreprise: regexn } },
              {
                $match: {
                  statut:
                    statut === 'inactif'
                      ? 'inactif'
                      : statut === 'actif'
                      ? 'actif'
                      : regexs,
                },
              },
              { $match: { created_at: { $gte: sd, $lt: ed } } },
              {
                $lookup: {
                  from: 'typeusers',
                  localField: 'typeCompte',
                  foreignField: '_id',
                  as: 'type',
                },
              },
              { $unwind: '$type' },
            ],
            as: 'buyer',
          },
        },
        { $unwind: '$buyer' },
      ]);
      // console.log(buyers);
      return [...sellers, ...buyers];
    }

    console.log('no check');

    const admins = await this.userModel.find({
      role: 'Admin',
      statut:
        statut === 'inactif'
          ? 'inactif'
          : statut === 'actif'
          ? 'actif'
          : regexs,
      email: regex,
      nomEntreprise: regexn,
      pseudo: regexp,
      created_at: { $gte: sd, $lt: ed },
    });
    const sellers = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'sellers',
          localField: '_id',
          foreignField: 'userId',
          pipeline: [
            {
              $match: {
                statut:
                  statut === 'inactif'
                    ? 'inactif'
                    : statut === 'actif'
                    ? 'actif'
                    : regexs,
                email: regex,
                nomEntreprise: regexn,
                pseudo: regexp,
              },
            },
            {
              $lookup: {
                from: 'typeusers',
                localField: 'typeCompte',
                foreignField: '_id',
                as: 'type',
              },
            },
            { $unwind: '$type' },
            { $match: { created_at: { $gte: sd, $lt: ed } } },
          ],
          as: 'seller',
        },
      },
      { $unwind: '$seller' },
    ]);
    // console.log(sellers);
    const buyers = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'buyers',
          localField: '_id',
          foreignField: 'userId',
          pipeline: [
            {
              $match: {
                statut:
                  statut === 'inactif'
                    ? 'inactif'
                    : statut === 'actif'
                    ? 'actif'
                    : regexs,
                email: regex,
                nomEntreprise: regexn,
                pseudo: regexp,
              },
            },
            { $match: { created_at: { $gte: sd, $lt: ed } } },
            {
              $lookup: {
                from: 'typeusers',
                localField: 'typeCompte',
                foreignField: '_id',
                as: 'type',
              },
            },
            { $unwind: '$type' },
          ],
          as: 'buyer',
        },
      },
      { $unwind: '$buyer' },
    ]);
    return [...admins, ...sellers, ...buyers];
    // return this.findAll2();
  }

  /*
    findAllAdminsOccurence(arguments listed below...)
    argumets of findAllWithOccurence:
      email: string
      startDate: string
      endDate: string
      statut: string

      -Filters all the admins by the given users.
      -If all given fields are empty it returns all the admins without filters.
      -It returns an an array containing the admins followed by the sellers followed by the buyers (see below)
      - adminsOcc: [{admin1}, {admin2},... ]
  */
  findAdminsWithOccurence(
    email: string,
    startDate: string,
    endDate: string,
    statut: string,
  ) {
    console.log('startDate: ', startDate);
    console.log('endDate: ', endDate);
    let sd = new Date(0);
    let ed = new Date();
    const e = email;
    const s = statut;
    if (startDate !== '') {
      sd = new Date(startDate);
    }
    if (endDate !== '') {
      ed = new Date(endDate);
    }
    const regex = new RegExp(e, 'i'); // i for case insensitive
    const regexs = new RegExp(s, 'i'); // i for case insensitive

    if (statut === '') {
      return this.userModel.find({
        email: { $regex: regex },
        created_at: { $gte: sd, $lt: ed },
        statut: { $regex: regexs },
        // isArchived: false,
      });
    }
    return this.userModel.find({
      email: { $regex: regex },
      created_at: { $gte: sd, $lt: ed },
      statut,
      // isArchived: false,
    });
  }

  /*
    usersWithAgregation()

    -Find all users with the use of agregations
    -It returns an an array containing the admins followed by the sellers followed by the buyers (see below)
    -usersWithAgregation: [{admin1}, {admin2}, {seller1}, {buyer1},...]
  */
  async usersWithAgregation() {
    const admins = await this.userModel.find({
      role: 'Admin',
    });
    const sellers = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'sellers',
          localField: '_id',
          foreignField: 'userId',
          as: 'seller',
          pipeline: [
            {
              $lookup: {
                from: 'typeusers',
                localField: 'typeCompte',
                foreignField: '_id',
                as: 'type',
              },
            },
            { $unwind: '$type' },
          ],
        },
      },
      { $unwind: '$seller' },
    ]);
    const buyers = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'buyers',
          localField: '_id',
          foreignField: 'userId',
          as: 'buyer',
          pipeline: [
            {
              $lookup: {
                from: 'typeusers',
                localField: 'typeCompte',
                foreignField: '_id',
                as: 'type',
              },
            },
            { $unwind: '$type' },
          ],
        },
      },
      { $unwind: '$buyer' },
    ]);
    return [...admins, ...sellers, ...buyers];
  }

  /*
    findOne(id: string)

    -Find the user with the given id
    -It returns the user with the given id
  */
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`User ${id} not found!`);
    }
    return user;
  }

  /*
    update(id: string, updateUserInput: UpdateUserInput)

    -Updates the user with the given id with the updates given in updateUserInput
    -It returns the updated user
  */
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

  /*
    remove(id: string)

    -Removes the user with the given id with the updates given in updateUserInput
    -Returns true if the user is removed or throws an exception if the id given does not match any user. 
  */
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

  /*
    LoginUser(loginUserInput: LoginUserInput)

    -updates the last_connected fields in the respective collections
    -generates tokens based on the user credentials
    -generates the cookies and send's them with the response
    -sets the headers fors CORS
    -updates the hash of the refresh token stroed in the DB (not used yet)
    -returns the loged in user
  */

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
      } else if (user.role === 'BuyerSeller') {
        const seller = await this.sellerModel.findOne({
          email: loginUserInput.email,
        });
        seller.last_connected = new Date();
        seller.save();
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
      ctx.res.setHeader(
        'Access-Control-Allow-Origin',
        `${
          process.env.NODE_ENV === 'production'
            ? this.config.get('FRONTEND_URI')
            : 'http://localhost:5000'
        }`,
      );
      console.log(ctx.res);
      await this.updateRtHash(user.id, tokens.refresh_token);
      return user;
    }
  }

  /*
    Logout(loginUserInput: LoginUserInput)

    -checks if the access_token is in the request
    -decodes the acess token to get the payload
    -sets the hash of the refresh token null (not used yet)
    -removes the cookies (not working properly on production for some reason...) 
    -returns true if no exception was thrown
  */
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

  /*
    refreshTokens(id: string, rt: string)

    -verifys if the given refresh token is valid with the refresh token in the DB
    -returns a new set of tokens
  */
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

  /**
    updateRtHash(id: number, rt: string)
    -updates the hash of the refresh token
    -returns void (nothing)

   */
  async updateRtHash(id: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.userModel.updateOne({ _id: id }, { hashed_rt: hash });
  }

  /**
    archive(id: string)
    -archives the user with the given id
    -returns true if no exception was thrown
   */
  async archive(id: string): Promise<boolean> {
    // update many to prevent spaming the logout button?
    const user = await this.userModel.updateOne(
      { _id: id },
      {
        isArchived: true, // TODO
      },
    );

    if (!user) {
      throw new NotFoundException();
    }
    return true;
  }

  /**
    getMe(ctx: any)
    -takes the graphql execution context 
    -returns the loged in user if no exception was thrown
   */
  async getMe(ctx: any) {
    console.log(ctx.req.cookies);
    const at = ctx.req.cookies['access_token'];
    ctx.res.setHeader(
      'Access-Control-Allow-Origin',
      `${
        process.env.NODE_ENV === 'production'
          ? this.config.get('FRONTEND_URI')
          : 'http://localhost:5000'
      }`,
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
