import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { UserRole } from 'src/types/user-roles.enum';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'test@gmail.com', description: 'Электронная почта' })
  readonly email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @MaxLength(50)
  @ApiProperty({ example: 'pass123', description: 'Хэшированный пароль' })
  readonly password: string;

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

  @IsEnum(UserRole)
  @ApiProperty({ example: 'client', description: 'Роль' })
  readonly role: string;
}
