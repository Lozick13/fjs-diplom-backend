import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelModule } from 'src/hotel/hotel.module';
import { HotelRoomModule } from 'src/hotel/room/room.module';
import { UsersModule } from 'src/users/users.module';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    UsersModule,
    HotelRoomModule,
    HotelModule,
  ],
})
export class ReservationModule {}
