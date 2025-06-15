import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsString, MaxLength } from 'class-validator';
import { ID } from 'src/types/id.type';

export class UserSignUpResponseDto {
  @ApiProperty({ description: 'Уникальный идентификатор', example: '123' })
  @IsMongoId()
  id: ID;

  @IsEmail()
  @ApiProperty({ example: 'test@gmail.com', description: 'Электронная почта' })
  readonly email: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty({ example: 'Shrek', description: 'Имя' })
  readonly name: string;
}
