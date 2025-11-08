import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsISO8601, IsInt } from 'class-validator';
import { EstadoExpediente } from '../expediente.entity';

export class UpdateExpedienteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ enum: EstadoExpediente })
  @IsOptional()
  @IsEnum(EstadoExpediente)
  estado?: EstadoExpediente;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  fecha_inicio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  fecha_cierre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  id_cliente?: number;
}
