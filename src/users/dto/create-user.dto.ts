import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/types/user-roles.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
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
  @IsDefined()
  @MinLength(3)
  @IsString()
  @MaxLength(50)
  @ApiProperty({ example: 'Shrek', description: 'Имя' })
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

  @IsEnum(UserRole)
  @IsNotEmpty()
  @ApiProperty({
    example: UserRole.CLIENT,
    description: 'Роль',
    enum: UserRole,
    required: true,
  })
  readonly role: UserRole;
}
