import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expediente } from './expediente.entity';
import { Cliente } from 'src/clientes/cliente.entity';
import { ExpedientesService } from './expedientes.service';
import { ExpedientesController } from './expedientes.controller';
import { DocumentoRef } from 'src/documentos/documento-ref.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Expediente, Cliente, DocumentoRef])],
  providers: [ExpedientesService],
  controllers: [ExpedientesController],
  exports: [TypeOrmModule, ExpedientesService],
})
export class ExpedientesModule {}
