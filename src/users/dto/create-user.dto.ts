import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@gmail.com', description: 'Электронная почта' })
  readonly email: string;

  @ApiProperty({ example: 'pass123', description: 'Хэшированный пароль' })
  readonly password: string;

  @ApiProperty({ example: 'Shrek', description: 'Имя' })
  readonly name: string;

  @ApiProperty({ example: '+79990001122', description: 'Номер телефона' })
  readonly contactPhone?: string;

  @ApiProperty({ example: 'client', description: 'Роль' })
  readonly role: string;
}
