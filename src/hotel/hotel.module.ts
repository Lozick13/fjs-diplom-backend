import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';

@Module({
  providers: [HotelService],
})
export class HotelModule {}
