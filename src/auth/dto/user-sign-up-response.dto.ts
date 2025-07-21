import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ID } from 'src/types/id.type';

export class UserSignUpResponseDto {
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
  @MaxLength(50)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Shrek',
    description: 'Имя',
    required: true,
  })
  readonly name: string;
}
