import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class UserSignInResponseDto {
  @IsEmail()
  @ApiProperty({ example: 'test@gmail.com', description: 'Электронная почта' })
  readonly email: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty({ example: 'Shrek', description: 'Имя' })
  readonly name: string;

  @IsPhoneNumber('RU')
  @IsOptional()
  @ApiPropertyOptional({
    example: '+79990001122',
    description: 'Номер телефона',
  })
  readonly contactPhone?: string;
}
