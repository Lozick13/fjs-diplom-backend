import { ApiProperty } from '@nestjs/swagger';
import { ID } from 'src/types/id.type';

export class CreateRoomDto {
  @ApiProperty({ example: '123', description: 'ID гостиницы комнаты' })
  readonly hotel: ID;

  @ApiProperty({ example: 'Люкс', description: 'Описание' })
  readonly description: string;

  @ApiProperty({ example: [], description: 'Список изображений' })
  readonly images: string[];

  @ApiProperty({ example: true, description: 'Доступность комнаты' })
  readonly isEnabled: boolean;
}
