import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Auth } from 'src/decorators/auth.decorator';
import { Login } from 'src/decorators/login.decorator';
import { ID } from 'src/types/id.type';
import { UserRole } from 'src/types/user-roles.enum';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { UserSignInResponseDto } from './dto/user-sign-in-response.dto';
import { UserSignUpResponseDto } from './dto/user-sign-up-response.dto';
import { SignUpDto } from './dto/user-sign-up.dto';

@ApiTags('Аутентификация и авторизация')
@Controller()
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({
    summary: 'Вход.',
    description: 'Стартует сессию пользователя и выставляет Cookies.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          default: 'admin@site.ru',
        },
        password: { type: 'string', default: '12345' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Если пользователя с указанным email не существует или пароль неверный',
  })
  @Login()
  @Post('auth/login')
  login(@Req() req: Request): UserSignInResponseDto {
    const user = req.user as User;
    if (!user) {
      throw new BadRequestException('Ошибка аутентификации');
    }

    return {
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    };
  }

  @ApiOperation({
    summary: 'Выход.',
    description:
      'Завершает сессию пользователя и удаляет Cookies. Доступно только аутентифицированным пользователям.',
  })
  @Auth()
  @Post('auth/logout')
  async logout(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      request.session.destroy((err) => {
        if (err) {
          reject(new BadRequestException('Не удалось завершить сессию'));
        } else {
          response.clearCookie('connect.sid');
          response.status(HttpStatus.OK).json({
            message: 'Вы успешно вышли',
          });
          resolve();
        }
      });
    });
  }

  @ApiOperation({
    summary: 'Регистрация.',
    description: 'Позволяет создать пользователя с ролью client в системе.',
  })
  @ApiResponse({
    status: 400,
    description: 'Пользователь с таким email уже существует',
  })
  @Post('client/register')
  async register(@Body() data: SignUpDto): Promise<UserSignUpResponseDto> {
    const user = await this.userService.create({
      ...data,
      role: UserRole.CLIENT,
    });
    return {
      id: user._id as ID,
      email: user.email,
      name: user.name,
    };
  }
}
