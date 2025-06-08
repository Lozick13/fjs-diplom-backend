import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { HotelRoomModule } from './room/room.module';
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
