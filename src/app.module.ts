import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { HotelModule } from './hotel/hotel.module';
import { ReservationModule } from './reservation/reservation.module';
import { SupportRequestModule } from './support-request/support-request.module';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/',
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    UsersModule,
    HotelModule,
    AuthModule,
    ReservationModule,
    SupportRequestModule,
  ],
})
export class AppModule {}
