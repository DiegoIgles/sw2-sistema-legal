import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateNotaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id_expediente: number;

  @ApiProperty({ example: 'Contenido de la nota' })
  @IsString()
  contenido: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tipo?: string | null;
}
