import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { HotelController } from './hotel/hotel.controller';
import { HotelModule } from './hotel/hotel.module';

@Module({
  controllers: [HotelController],
  providers: [],
  imports: [
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
    MongooseModule.forRoot(
      process.env.MONGO_HOST || 'mongodb://localhost:27017',
    ),
    UsersModule,
    HotelModule,
  ],
})
export class AppModule {}
