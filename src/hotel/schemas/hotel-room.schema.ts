import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class HotelRoom extends Document {
  @ApiProperty({ example: '123', description: 'ID гостиницы комнаты' })
  @Prop({ required: true, unique: false, type: Types.ObjectId, ref: 'Hotel' })
  hotel: Types.ObjectId;

  @ApiProperty({ example: 'Люкс', description: 'Описание комнаты' })
  @Prop({ required: false, unique: false })
  description: string;

  @ApiProperty({ example: [], description: 'Список изображений' })
  @Prop({ required: false, unique: false, default: [] })
  images: string[];

  @ApiProperty({ example: true, description: 'Доступность комнаты' })
  @Prop({
    required: true,
    unique: false,
    default: true,
    type: Boolean,
  })
  isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
