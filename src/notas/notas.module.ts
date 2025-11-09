import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nota } from './nota.entity';
import { NotasService } from './notas.service';
import { NotasController } from './notas.controller';
import { Expediente } from 'src/expedientes/expediente.entity';
import { RealtimeModule } from 'src/realtime/realtime.module';
import { AuthClienteModule } from 'src/auth-cliente/auth-cliente.module';
@Module({
  imports: [TypeOrmModule.forFeature([Nota, Expediente]), RealtimeModule, AuthClienteModule],
  controllers: [NotasController],
  providers: [NotasService],
})
export class NotasModule {}
