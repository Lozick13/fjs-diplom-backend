import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { UserRole } from 'src/types/user-roles.enum';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { HotelService } from './hotel.service';
import { UpdateHotelParams } from './interfaces/update-hotel-params.interfaces';
import { Hotel } from './schemas/hotel.schema';

@ApiTags('Гостиницы')
@Controller('')
export class HotelController {
  constructor(private hotelService: HotelService) {}

  private mapToHotelResponseDto(hotel: Hotel) {
    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    };
  }

  @ApiOperation({ summary: 'Создание гостиницы' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.ADMIN)
  @Post('admin/hotels')
  async create(@Body() hotelDto: CreateHotelDto) {
    const hotel = await this.hotelService.create(hotelDto);
    return this.mapToHotelResponseDto(hotel);
  }

  @ApiOperation({ summary: 'Получение списка гостиниц администратором' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.ADMIN)
  @Get('admin/hotels/')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'title', required: true })
  async search(
    @Query('title') title: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const hotels = await this.hotelService.search({
      title,
      limit,
      offset,
    });
    return hotels.map((hotel) => this.mapToHotelResponseDto(hotel));
  }

  @ApiOperation({ summary: 'Поиск гостиницы по ID' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.ADMIN)
  @Get('/admin/hotels/:id')
  async find(@Param('id') id: string) {
    const hotel = await this.hotelService.findById(id);
    return this.mapToHotelResponseDto(hotel);
  }

  @ApiOperation({ summary: 'Обновление гостиницы по ID' })
  @ApiResponse({ status: 200 })
  @Auth(UserRole.ADMIN)
  @Put('admin/hotels/:id')
  async update(@Param('id') id: string, @Body() data: UpdateHotelParams) {
    const hotel = await this.hotelService.update(id, data);
    return this.mapToHotelResponseDto(hotel);
  }
}
