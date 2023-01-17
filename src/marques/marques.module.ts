
import { Module } from '@nestjs/common';
import { MarquesService } from './marques.service';
import { MarquesResolver } from './marques.resolver';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Marque, MarqueSchema } from './entities/marque.entity';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Marque.name,
        schema: MarqueSchema,
      },
    ]),
    
  ],
  providers: [MarquesResolver, MarquesService],
  exports: [MarquesService],
})
export class MarquesModule {}
 