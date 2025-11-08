import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'contra123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'user' , required: false})
  @IsOptional()
  @IsString()
  rol?: string;
}
