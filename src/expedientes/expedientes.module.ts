import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expediente } from './expediente.entity';
import { Cliente } from 'src/clientes/cliente.entity';
import { ExpedientesService } from './expedientes.service';
import { ExpedientesController } from './expedientes.controller';
import { DocumentoRef } from 'src/documentos/documento-ref.entity';
import { AuthClienteModule } from 'src/auth-cliente/auth-cliente.module';
@Module({
  imports: [TypeOrmModule.forFeature([Expediente, Cliente, DocumentoRef]), AuthClienteModule],
  providers: [ExpedientesService],
  controllers: [ExpedientesController],
  exports: [TypeOrmModule, ExpedientesService],
})
export class ExpedientesModule {}
