import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ID } from 'src/types/id.type';
import { UserRole } from 'src/types/user-roles.enum';

export class UserSignInResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  id: ID;

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
