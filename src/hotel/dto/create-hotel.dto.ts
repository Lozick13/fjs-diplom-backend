import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateHotelDto {
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Уют',
    description: 'Название гостиницы',
    required: true,
  })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  @ApiProperty({
    example: 'Хороший отель',
    description: 'Описание',
    required: true,
  })
  readonly description: string;
}
