import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsMongoId, IsNotEmpty } from 'class-validator';
import { ID } from 'src/types/id.type';

export class MarkMessagesAsReadDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID пользователя',
    required: true,
  })
  readonly user: ID;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'ID чата',
    required: true,
  })
  readonly supportRequest: ID;

  @IsISO8601({ strict: true })
  @IsNotEmpty()
  @ApiProperty({
    example: '2025-06-20T09:16:55.193+00:00',
    description: 'Дата создания',
    required: true,
  })
  readonly createdBefore: Date;
}
