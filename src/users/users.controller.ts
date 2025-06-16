import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { UserRole } from 'src/types/user-roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Auth(UserRole.ADMIN)
  @Post('/create')
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @ApiOperation({ summary: 'Поиск пользователя по ID' })
  @ApiResponse({ status: 200, type: User })
  @Auth(UserRole.ADMIN, UserRole.MANAGER)
  @Get('/search/:id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Поиск пользователя по email' })
  @ApiResponse({ status: 200, type: User })
  @Auth(UserRole.ADMIN, UserRole.MANAGER)
  @Get('search/email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Поиск пользователей по данным' })
  @ApiResponse({ status: 200, type: [User] })
  @Auth(UserRole.ADMIN, UserRole.MANAGER)
  @Get('/search')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'contactPhone', required: false })
  search(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('contactPhone') contactPhone?: string,
  ) {
    return this.usersService.findAll({
      limit,
      offset,
      email,
      name,
      contactPhone,
    });
  }
}
