import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from '../schemas/hotel-room.schema';
import { Hotel, HotelSchema } from '../schemas/hotel.schema';
import { HotelRoomController } from './room.controller';
import { HotelRoomService } from './room.service';

@Module({
  providers: [HotelRoomService],
  controllers: [HotelRoomController],
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    MongooseModule.forFeature([
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
})
export class HotelRoomModule {}
