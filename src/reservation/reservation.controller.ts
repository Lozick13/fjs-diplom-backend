import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Auth } from 'src/decorators/auth.decorator';
import { LoggedUser } from 'src/decorators/user.decorator';
import { HotelService } from 'src/hotel/hotel.service';
import { HotelRoomService } from 'src/hotel/room/room.service';
import { HotelRoom } from 'src/hotel/schemas/hotel-room.schema';
import { Hotel } from 'src/hotel/schemas/hotel.schema';
import { ID } from 'src/types/id.type';
import { UserRole } from 'src/types/user-roles.enum';
import { UsersService } from 'src/users/users.service';
import { AddReservationDto } from './dto/add-reservation.dto';
import { ReservationSearchOptionsDto } from './dto/reservation-search-options.dto';
import { ReservationService } from './reservation.service';
import { Reservation } from './schemas/reservation.schema';

@ApiTags('Брони')
@Controller('')
export class ReservationController {
  constructor(
    private reservationService: ReservationService,
    private usersService: UsersService,
    private hotelRoomService: HotelRoomService,
    private hotelService: HotelService,
  ) {}

  private buildReservationResponse(
    reservation: Reservation,
    room: HotelRoom,
    hotel: Hotel,
  ) {
    return {
      startDate: reservation.dateStart,
      endDate: reservation.dateEnd,
      hotelRoom: {
        description: room.description,
        images: room.images,
      },
      hotel: {
        title: hotel.title,
        description: hotel.description,
      },
    };
  }

  @ApiOperation({ summary: 'Добавление брони' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.CLIENT)
  @Post('client/reservations')
  async add(
    @Body() reservationDto: AddReservationDto,
    @LoggedUser('email') email: string,
  ) {
    const user = await this.usersService.findByEmail(email);
    const room = await this.hotelRoomService.findById(reservationDto.hotelRoom);
    const hotel = await this.hotelService.findById(room.hotel.toString() as ID);
    const reservation = await this.reservationService.addReservation({
      userId: (user._id as mongoose.Types.ObjectId).toString() as ID,
      hotelId: room.hotel.toString() as ID,
      roomId: (room._id as mongoose.Types.ObjectId).toString() as ID,
      dateStart: reservationDto.startDate,
      dateEnd: reservationDto.endDate,
    });

    return this.buildReservationResponse(reservation, room, hotel);
  }

  @ApiOperation({ summary: 'Получение броней пользователя' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.CLIENT)
  @Get('client/reservations')
  @ApiQuery({ name: 'dateStart', required: false })
  @ApiQuery({ name: 'dateEnd', required: false })
  async search(
    @LoggedUser('email') email: string,
    @Query() query: ReservationSearchOptionsDto,
  ) {
    const user = await this.usersService.findByEmail('test1@2gmail.com');
    const options: ReservationSearchOptionsDto = {
      userId: (user._id as mongoose.Types.ObjectId).toString(),
      dateStart: query.dateStart,
      dateEnd: query.dateEnd,
    };

    const reservations = await this.reservationService.getReservations(options);
    return await Promise.all(
      reservations.map(async (reservation) => {
        const room = await this.hotelRoomService.findById(
          reservation.roomId.toString() as ID,
        );
        const hotel = await this.hotelService.findById(
          reservation.hotelId.toString() as ID,
        );

        return this.buildReservationResponse(reservation, room, hotel);
      }),
    );
  }

  @ApiOperation({ summary: 'Удаление брони' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.CLIENT)
  @Delete('client/reservations/:id')
  async removeClient(
    @Param('id') id: string,
    @LoggedUser() user: { id: ID; role: UserRole },
  ) {
    if (user.role === UserRole.CLIENT) {
      const reservation = await this.reservationService.getReservationById(id);
      if (!reservation) {
        throw new NotFoundException('Бронь не найдена');
      }
      if (reservation.userId.toString() !== user.id) {
        throw new ForbiddenException('Вы можете удалять только свои брони');
      }
    }

    await this.reservationService.removeReservation(id);
  }

  @ApiOperation({ summary: 'Удаление брони' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.CLIENT, UserRole.MANAGER)
  @Delete('manager/reservations/:id')
  async removeManager(@Param('id') id: string) {
    await this.reservationService.removeReservation(id);
  }

  @ApiOperation({ summary: 'Список броней конкретного пользователя' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.MANAGER)
  @Get('manager/reservations/:id')
  @ApiQuery({ name: 'dateStart', required: false })
  @ApiQuery({ name: 'dateEnd', required: false })
  async searchById(
    @Param('id') id: string,
    @Query() query: ReservationSearchOptionsDto,
  ) {
    const options: ReservationSearchOptionsDto = {
      userId: id,
      dateStart: query.dateStart,
      dateEnd: query.dateEnd,
    };

    const reservations = await this.reservationService.getReservations(options);
    return await Promise.all(
      reservations.map(async (reservation) => {
        const room = await this.hotelRoomService.findById(
          reservation.roomId.toString() as ID,
        );
        const hotel = await this.hotelService.findById(
          reservation.hotelId.toString() as ID,
        );

        return this.buildReservationResponse(reservation, room, hotel);
      }),
    );
  }
}
