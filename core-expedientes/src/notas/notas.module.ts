import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nota } from './nota.entity';
import { NotasService } from './notas.service';
import { NotasController } from './notas.controller';
import { Expediente } from 'src/expedientes/expediente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nota, Expediente])],
  controllers: [NotasController],
  providers: [NotasService],
})
export class NotasModule {}
