import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMarqueInput } from './dto/create-marque.input';
import { UpdateMarqueInput } from './dto/update-marque.input';
import { Marque, StatutMarque } from './entities/marque.entity';

@Injectable()
export class MarquesService {
  constructor(
    @InjectModel(Marque.name)
    private readonly MarqueModel: Model<Marque>,
  ) {}

  async create(createMarqueInput: CreateMarqueInput): Promise<Marque> {
    console.log(createMarqueInput);
    const marque = await this.MarqueModel.findOne({
      libelle: createMarqueInput.libelle,
    }).exec();
    if (marque) {
      throw new BadRequestException('Cette marque existe déjà');
    }
    createMarqueInput.created_at = new Date();
    createMarqueInput.statut = StatutMarque.NEW;
    const newMarque = new this.MarqueModel(createMarqueInput);
    newMarque.save();
    return newMarque;
  }
  findAll() {
    return this.MarqueModel.find().exec();
  }

  async findOne(id: string) {
    const marque = await this.MarqueModel.findOne({ _id: id }).exec();
    if (!marque) {
      throw new NotFoundException(`La marque ${id} n'existe pas!`);
    }
    return marque;
  }

  async update(
    id: string,
    updateMarqueInput: UpdateMarqueInput,
  ): Promise<Marque> {
    const marque = await this.MarqueModel.findOne({
      libelle: updateMarqueInput.libelle,
    }).exec();
    if (marque) {
      throw new BadRequestException('Cette marque existe déjà');
    }
    const updatedMarque = await this.MarqueModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateMarqueInput },
      { new: true },
    );
    if (!updatedMarque) {
      throw new NotFoundException(`La marque ${id} n'existe pas!`);
    }
    return updatedMarque;
  }

  async remove(id: string) {
    const marque = await this.MarqueModel.findOne({ _id: id }).exec();
    if (!marque) {
      throw new NotFoundException(`La marque ${id} n'existe pas!`);
    }
    marque.remove();
    return true;
  }

  async removeAll() {
    await this.MarqueModel.remove({}).exec();
    return true;
  }
}
