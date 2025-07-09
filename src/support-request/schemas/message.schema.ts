import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @ApiProperty({ example: '123', description: 'ID автора' })
  @Prop({ required: true, unique: false, type: Types.ObjectId, ref: 'User' })
  author: Types.ObjectId;

  @ApiProperty({ example: '20-05-2025', description: 'Дата отправки' })
  @Prop({ required: true, unique: false })
  sentAt: Date;

  @ApiProperty({
    example: 'Тестовое сообщение',
    description: 'Текст сообщения',
  })
  @Prop({ required: true, unique: false })
  text: string;

  @ApiProperty({ example: '20-05-2025', description: 'Дата прочтения' })
  @Prop({ required: false, unique: false })
  readAt: Date;
  createdAt: Date;
}

export const MessagesSchema = SchemaFactory.createForClass(Message);
