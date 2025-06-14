import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ default: 'test@site.ru' })
  @IsEmail({}, { message: 'Некорректный формат email адреса' })
  @IsNotEmpty({ message: 'Поле "email" не должно быть пустым' })
  readonly email: string;

  @ApiProperty({ default: '123456' })
  @IsNotEmpty({ message: 'Поле "password" не должно быть пустым' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  readonly password: string;

  @ApiProperty({ default: 'test' })
  @IsNotEmpty({ message: 'Поле "name" не должно быть пустым' })
  readonly name: string;

  @ApiProperty({ default: '89123456789' })
  @IsPhoneNumber('RU', { message: 'Некорректный формат номера телефона' })
  @IsOptional()
  readonly contactPhone: string;
}
