import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ID } from 'src/types/id.type';

export class ReservationSearchOptionsDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID пользователя',
    required: true,
  })
  readonly userId: ID;

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
  @IsOptional()
  @ApiProperty({
    example: '20-01-2025',
    description: 'Начало брони',
    required: false,
  })
  dateStart?: Date;

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
  @IsOptional()
  @ApiProperty({
    example: '25-01-2025',
    description: 'Конец брони',
    required: false,
  })
  dateEnd?: Date;
}
