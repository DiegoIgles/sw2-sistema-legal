import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plazo } from './plazo.entity';
import { PlazosService } from './plazos.service';
import { PlazosController } from './plazos.controller';
import { Expediente } from 'src/expedientes/expediente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plazo, Expediente])],
  controllers: [PlazosController],
  providers: [PlazosService],
})
export class PlazosModule {}
