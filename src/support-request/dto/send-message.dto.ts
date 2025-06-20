import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { ID } from 'src/types/id.type';

export class SendMessageDto {
  @ApiProperty({ example: '123', description: 'ID автора' })
  readonly author: ID;

  @ApiProperty({ example: '123', description: 'ID чата' })
  readonly supportRequest: ID;

  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    example: 'Тестовое сообщение',
    description: 'Текст сообщения',
  })
  readonly text: string;
}
