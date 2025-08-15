import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ID } from 'src/types/id.type';

export class UpdateRoomDto {
  @ApiProperty({ example: '123', description: 'ID гостиницы комнаты' })
  @IsString()
  readonly hotel: ID;

  @ApiProperty({ example: 'Люкс', description: 'Описание' })
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Массив существующих изображений (URL)',
    required: false,
  })
  readonly existingImages?: string[];

  @ApiProperty({
    example: true,
    description: 'Доступность комнаты',
    required: false,
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  readonly isEnabled?: boolean;
}
