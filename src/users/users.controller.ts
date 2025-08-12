import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Auth } from 'src/decorators/auth.decorator';
import { ID } from 'src/types/id.type';
import { UserRole } from 'src/types/user-roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('Пользователи')
@Controller('')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.ADMIN)
  @Post('admin/users/')
  async create(@Body() userDto: CreateUserDto) {
    if (userDto.role === UserRole.ADMIN) {
      throw new ForbiddenException('Нельзя создать пользователя с ролью ADMIN');
    }

    const user = await this.usersService.create(userDto);
    return {
      id: (user._id as mongoose.Types.ObjectId).toString() as ID,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role,
    };
  }

  @ApiOperation({ summary: 'Поиск пользователей по данным' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.ADMIN)
  @Get('admin/users/')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'contactPhone', required: false })
  async searchAdmin(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('contactPhone') contactPhone?: string,
  ) {
    const users = await this.usersService.findAll({
      limit,
      offset,
      email,
      name,
      contactPhone,
    });
    return users.map((user) => ({
      id: (user._id as mongoose.Types.ObjectId).toString() as ID,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
      role: user.role,
    }));
  }

  @ApiOperation({ summary: 'Поиск пользователей по данным' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.MANAGER)
  @Get('manager/users/')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'contactPhone', required: false })
  async searchManager(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('contactPhone') contactPhone?: string,
  ) {
    const users = await this.usersService.findAll({
      limit,
      offset,
      email,
      name,
      contactPhone,
    });

    return users
      .filter((user) => user.role === UserRole.CLIENT)
      .map((user) => ({
        id: (user._id as mongoose.Types.ObjectId).toString() as ID,
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
      }));
  }
}
