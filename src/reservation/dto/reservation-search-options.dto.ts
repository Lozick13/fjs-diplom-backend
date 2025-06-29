import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ID } from 'src/types/id.type';

export class ReservationSearchOptionsDto {
  @ApiProperty({ example: '123', description: 'ID пользователя' })
  readonly userId: ID;

  @ApiProperty({
    example: '20-01-2025',
    description: 'Начало брони',
  })
  @Transform(({ value }: { value: Date | string }) => {
    if (value instanceof Date) return value;

    if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      throw new BadRequestException(
        'Неверный формат даты. Используйте DD-MM-YYYY',
      );
    }
    const [day, month, year] = value.split('-');
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  })
  dateStart?: Date;

  @ApiProperty({
    example: '25-01-2025',
    description: 'Конец брони',
  })
  @Transform(({ value }: { value: Date | string }) => {
    if (value instanceof Date) return value;

    if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      throw new BadRequestException(
        'Неверный формат даты. Используйте DD-MM-YYYY',
      );
    }
    const [day, month, year] = value.split('-');
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  })
  dateEnd?: Date;
}
