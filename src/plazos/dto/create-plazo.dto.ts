import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsISO8601 } from 'class-validator';

export class CreatePlazoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id_expediente: number;

  @ApiProperty({ example: 'Presentar demanda' })
  @IsString()
  descripcion: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsISO8601()
  fecha_vencimiento: string;
}
