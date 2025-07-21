import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserSignInResponseDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Электронная почта',
    required: true,
  })
  readonly email: string;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    example: 'Shrek',
    description: 'Имя',
    required: true,
  })
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
