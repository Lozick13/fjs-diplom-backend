import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { UserRoles } from 'src/types/user-roles.type';

@Schema()
export class User extends Document {
  @ApiProperty({ example: 'test@gmail.com', description: 'Электронная почта' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: 'pass123', description: 'Хэшированный пароль' })
  @Prop({ required: true, unique: false })
  passwordHash: string;

  @ApiProperty({ example: 'Shrek', description: 'Имя' })
  @Prop({ required: true, unique: false })
  name: string;

  @ApiProperty({ example: '+79990001122', description: 'Номер телефона' })
  @Prop({ required: false, unique: false })
  contactPhone: string;

  @ApiProperty({ example: 'client', description: 'Роль' })
  @Prop({
    required: true,
    unique: false,
    default: 'client',
    type: String,
  })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
