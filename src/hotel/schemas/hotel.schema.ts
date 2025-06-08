import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Hotel extends Document {
  @ApiProperty({ example: 'Уют', description: 'Название гостиницы' })
  @Prop({ required: true, unique: false })
  title: string;

  @ApiProperty({ example: 'Хороший отель', description: 'Описание' })
  @Prop({ required: false, unique: false })
  description: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
