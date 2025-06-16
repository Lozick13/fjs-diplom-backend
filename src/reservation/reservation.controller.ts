import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationSearchOptionsDto } from './dto/reservation-search-options.dto';
import { ReservationService } from './reservation.service';
import { Reservation } from './schemas/reservation.schema';

@ApiTags('Брони')
@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @ApiOperation({ summary: 'Добавление брони' })
  @ApiResponse({ status: 200, type: Reservation })
  @Post('/add')
  add(@Body() reservationDto: CreateReservationDto) {
    return this.reservationService.addReservation(reservationDto);
  }

  @ApiOperation({ summary: 'Удаление брони брони' })
  @ApiResponse({ status: 200 })
  @Get('/remove/:id')
  remove(@Param('id') id: string) {
    return this.reservationService.removeReservation(id);
  }

  @ApiOperation({ summary: 'Получение брони' })
  @ApiResponse({ status: 200, type: [Reservation] })
  @Get('/search')
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'dateStart', required: true })
  @ApiQuery({ name: 'dateEnd', required: true })
  search(@Query() filter: ReservationSearchOptionsDto) {
    return this.reservationService.getReservations(filter);
  }
}
