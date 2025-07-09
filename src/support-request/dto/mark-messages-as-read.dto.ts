import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { ID } from 'src/types/id.type';

export class MarkMessagesAsReadDto {
  @ApiProperty({ example: '123', description: 'ID пользователя' })
  readonly user: ID;

  @ApiProperty({ example: '123', description: 'ID чата' })
  readonly supportRequest: ID;

  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    example: '2025-06-20T09:16:55.193+00:00',
    description: 'Дата создания',
  })
  readonly createdBefore: Date;
}
