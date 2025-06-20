import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { ID } from 'src/types/id.type';

export class CreateSupportRequestDto {
  @ApiProperty({ example: '123', description: 'ID пользователя' })
  readonly user: ID;

  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    example: 'Тестовое сообщение',
    description: 'Текст сообщения',
  })
  readonly text: string;
}
