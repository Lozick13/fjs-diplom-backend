import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Электронная почта',
    required: true,
  })
  readonly email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @ApiProperty({
    example: 'pass123',
    description: 'Хэшированный пароль',
    required: true,
  })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @ApiProperty({ example: 'Shrek', description: 'Имя', required: true })
  readonly name: string;

  @IsPhoneNumber('RU')
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '+79990001122',
    description: 'Номер телефона',
    required: false,
  })
  readonly contactPhone?: string;
}
