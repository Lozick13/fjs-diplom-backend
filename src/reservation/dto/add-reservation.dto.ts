import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ID } from 'src/types/id.type';

export class AddReservationDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ example: '123', description: 'ID комнаты', required: true })
  readonly hotelRoom: ID;

  @Transform(({ value }: { value: string }) => {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      throw new BadRequestException(
        'Неверный формат даты. Используйте DD-MM-YYYY',
      );
    }
    const [day, month, year] = value.split('-');
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  })
  @IsNotEmpty()
  @ApiProperty({
    example: '20-01-2025',
    description: 'Начало брони',
    required: true,
  })
  readonly startDate: Date;

  @Transform(({ value }: { value: string }) => {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      throw new BadRequestException(
        'Неверный формат даты. Используйте DD-MM-YYYY',
      );
    }
    const [day, month, year] = value.split('-');
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  })
  @IsNotEmpty()
  @ApiProperty({
    example: '25-01-2025',
    description: 'Конец брони',
    required: true,
  })
  readonly endDate: Date;
}
