import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ID } from 'src/types/id.type';

export class SendMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID автора',
    required: true,
  })
  readonly author: ID;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'ID чата',
    required: true,
  })
  readonly supportRequest: ID;

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
