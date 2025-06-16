import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Reservation extends Document {
  @ApiProperty({ example: '123', description: 'ID пользователя' })
  @Prop({ required: true, unique: false, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @ApiProperty({ example: '123', description: 'ID гостиницы' })
  @Prop({ required: true, unique: false, type: Types.ObjectId, ref: 'Hotel' })
  hotelId: Types.ObjectId;

  @ApiProperty({ example: '123', description: 'ID комнаты' })
  @Prop({ required: true, unique: false, type: Types.ObjectId, ref: 'Room' })
  roomId: Types.ObjectId;

  @ApiProperty({ example: '20.05.2025', description: 'Начало брони' })
  @Prop({ required: false, unique: false })
  dateStart: Date;

  @ApiProperty({ example: '25.05.2025', description: 'Конец брони' })
  @Prop({ required: false, unique: false })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
