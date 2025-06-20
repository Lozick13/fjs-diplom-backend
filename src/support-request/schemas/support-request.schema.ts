import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SupportRequest extends Document {
  @ApiProperty({ example: '123', description: 'ID пользователя' })
  @Prop({ required: true, unique: false, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @ApiProperty({ example: '20-05-2025', description: 'Дата создания' })
  @Prop({ required: true, unique: false })
  createdAt: Date;

  @ApiProperty({ example: '[]', description: 'Сообщения' })
  @Prop({ required: false, unique: false })
  messages: [];

  @ApiProperty({ example: true, description: 'Активность чата' })
  @Prop({ required: false, unique: false })
  isActive: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
