import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTypeUserInput } from './dto/create-type-user.input';
import { UpdateTypeUserInput } from './dto/update-type-user.input';
import { TypeUser } from './entities/type-user.entity';

@Injectable()
export class TypeUsersService {
  constructor(
    @InjectModel(TypeUser.name)
    private readonly TypeUserModel: Model<TypeUser>,
  ) {}

  async create(createTypeUserInput: CreateTypeUserInput): Promise<TypeUser> {
    const typeuser = await this.TypeUserModel.findOne({
      libelle: createTypeUserInput.libelle,
    }).exec();
    if (typeuser) {
      throw new BadRequestException("Ce type d'utilisateur existe déjà");
    }
    createTypeUserInput.created_at = new Date();
    const newtypeUser = new this.TypeUserModel(createTypeUserInput);
    console.log(createTypeUserInput);
    newtypeUser.save();
    return newtypeUser;
  }

  findAll() {
    return this.TypeUserModel.find().exec();
  }

  async findOne(id: string) {
    const typeUser = await this.TypeUserModel.findOne({ _id: id }).exec();
    if (!typeUser) {
      throw new NotFoundException(`Le type d'utilisateur ${id} n'existe pas!`);
    }
    return typeUser;
  }

  async update(
    id: string,
    updateTypeUserInput: UpdateTypeUserInput,
  ): Promise<TypeUser> {
    const typeuser = await this.TypeUserModel.findOne({
      libelle: updateTypeUserInput.libelle,
    }).exec();
    console.log(updateTypeUserInput);
    if (updateTypeUserInput?.libelle) {
      if (
        updateTypeUserInput?.for_buyer &&
        updateTypeUserInput?.for_seller &&
        updateTypeUserInput?.description
      ) {
        throw new BadRequestException("Ce type d'utilisateur existe déjà");
      }
    }
    const updatedtypeUser = await this.TypeUserModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateTypeUserInput },
      { new: true },
    );
    if (!updatedtypeUser) {
      throw new NotFoundException(`Le type d'utilisateur ${id} n'existe pas!`);
    }
    return updatedtypeUser;
  }

  async remove(id: string) {
    const typeUser = await this.TypeUserModel.findOne({ _id: id }).exec();
    if (!typeUser) {
      throw new NotFoundException(`Le type d'utilisateur ${id} n'existe pas!`);
    }
    typeUser.remove();
    return true;
  }

  async removeAll() {
    await this.TypeUserModel.remove({}).exec();
    return true;
  }
}
