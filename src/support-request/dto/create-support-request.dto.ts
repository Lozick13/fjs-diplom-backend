import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ID } from 'src/types/id.type';

export class CreateSupportRequestDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID пользователя',
    required: true,
  })
  readonly user: ID;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  @ApiProperty({
    example: 'Тестовое сообщение',
    description: 'Текст сообщения',
    required: true,
  })
  readonly text: string;
}
