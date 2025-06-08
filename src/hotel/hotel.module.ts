import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoomModule } from './hotel-room/hotel-room.module';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { Hotel, HotelSchema } from './schemas/hotel.schema';

@Module({
  providers: [HotelService],
  controllers: [HotelController],
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    HotelRoomModule,
  ],
})
export class HotelModule {}
