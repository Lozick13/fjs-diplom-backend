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
    example: '20-02-2025',
    description: 'Дата создания',
  })
  readonly createdBefore: Date;
}
