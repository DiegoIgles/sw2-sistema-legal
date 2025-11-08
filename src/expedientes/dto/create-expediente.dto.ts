import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsISO8601, IsInt } from 'class-validator';
import { EstadoExpediente } from '../expediente.entity';

export class CreateExpedienteDto {
  @ApiProperty({ example: 'Demanda contra empresa X' })
  @IsString()
  titulo: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ enum: EstadoExpediente, required: false })
  @IsOptional()
  @IsEnum(EstadoExpediente)
  estado?: EstadoExpediente;

  @ApiProperty({ example: '2025-01-01', required: false })
  @IsOptional()
  @IsISO8601()
  fecha_inicio?: string;

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsOptional()
  @IsISO8601()
  fecha_cierre?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  id_cliente: number;
}
