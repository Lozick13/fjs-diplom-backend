import { ApiProperty } from '@nestjs/swagger';
import { ID } from 'src/types/id.type';

export class UpdateRoomDto {
  @ApiProperty({ example: '123', description: 'ID гостиницы комнаты' })
  readonly hotel: ID;

  @ApiProperty({ example: 'Люкс', description: 'Описание' })
  readonly description: string;

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Массив существующих изображений (URL)',
  })
  readonly existingImages?: string[];

  @ApiProperty({ example: true, description: 'Доступность комнаты' })
  readonly isEnabled: boolean;
}
