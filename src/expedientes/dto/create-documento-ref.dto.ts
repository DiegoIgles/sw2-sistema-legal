import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateDocumentoRefDto {
  @ApiProperty({ example: 'storage-abc-123' })
  @IsString()
  doc_id_storage: string;

  @ApiProperty({ example: 'Contrato', required: false })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({ example: 'pdf', required: false })
  @IsOptional()
  @IsString()
  tipo?: string;
}
