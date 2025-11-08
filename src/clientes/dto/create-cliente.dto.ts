import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  nombre_completo: string;

  @ApiProperty({ example: 'juan@example.com', required: false })
  @IsOptional()
  @IsEmail()
  contacto_email?: string;

  @ApiProperty({ example: '+34123456789', required: false })
  @IsOptional()
  @IsString()
  contacto_tel?: string;
}
