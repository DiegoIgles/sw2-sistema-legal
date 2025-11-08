import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsEmail } from 'class-validator';

export class RegisterAuthClienteDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id_cliente: number;

  @ApiProperty({ example: 'cliente@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+34123456789', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'contra123' })
  @IsString()
  password: string;
}
