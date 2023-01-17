import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateModesPaiementInput } from './dto/create-modes-paiement.input';
import { UpdateModesPaiementInput } from './dto/update-modes-paiement.input';
import { ModesPaiement } from './entities/modes-paiement.entity';

@Injectable()
export class ModesPaiementService {
  constructor(
    @InjectModel(ModesPaiement.name)
    private readonly ModesPaiementModel: Model<ModesPaiement>,  
  ) {}

  async create(createModesPaiementInput: CreateModesPaiementInput) {
    const mode = await this.ModesPaiementModel.findOne({ mode_paiement: createModesPaiementInput.mode_paiement }).exec();
    if (mode) {
      throw new BadRequestException('Ce mode de paiement existe déjà');
    }
    createModesPaiementInput.created_at = new Date();
    const newmode= new this.ModesPaiementModel(createModesPaiementInput);
    console.log(createModesPaiementInput);
    newmode.save();
    return newmode;
  }

  findAll() {
    return this.ModesPaiementModel.find().exec();
  }

  async findOne(id: string) {
    const mode = await this.ModesPaiementModel.findOne({ _id: id }).exec();
    if (!mode) {
      throw new NotFoundException(`Mode de paiement ${id} n'existe pas!`);
    }
    return mode;
  }

  async update(id: string, updateModesPaiementInput: UpdateModesPaiementInput) {
    const mode = await this.ModesPaiementModel.findOne({ mode_paiement: updateModesPaiementInput.mode_paiement }).exec();
    if (mode) {
      throw new BadRequestException('Ce mode de paiement existe déjà');
    }
    const updatedmode = await this.ModesPaiementModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateModesPaiementInput },
      { new: true },
    );
    if (!updatedmode) {
      throw new NotFoundException(`Le mode de paiement ${id} n'existe pas!`);
    }
    return updatedmode;
  }

  async remove(id: string) {
    const mode = await this.ModesPaiementModel.findOne({ _id: id }).exec();
    if (!mode) {
      throw new NotFoundException(`Le mode de paiement ${id} n'existe pas!`);
    }   
    mode.remove();
    return true;
  }
}
