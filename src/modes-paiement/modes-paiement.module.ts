import { Module } from '@nestjs/common';
import { ModesPaiementService } from './modes-paiement.service';
import { ModesPaiementResolver } from './modes-paiement.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { ModesPaiement, ModesPaiementSchema } from './entities/modes-paiement.entity';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: ModesPaiement.name,
        schema: ModesPaiementSchema,
      },
    ]),
    
  ],
  providers: [ModesPaiementResolver, ModesPaiementService],
  exports: [ModesPaiementService],
})
export class ModesPaiementModule {}
