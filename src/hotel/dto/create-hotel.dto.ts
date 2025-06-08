import { ApiProperty } from '@nestjs/swagger';

export class CreateHotelDto {
  @ApiProperty({ example: 'Уют', description: 'Название гостиницы' })
  readonly title: string;

  @ApiProperty({ example: 'Хороший отель', description: 'Описание' })
  readonly description: string;
}
