import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNotaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contenido?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tipo?: string | null;
}
