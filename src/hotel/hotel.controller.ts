import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { HotelService } from './hotel.service';
import { UpdateHotelParams } from './interfaces/update-hotel-params.interfaces';
import { Hotel } from './schemas/hotel.schema';

@Controller('hotel')
export class HotelController {
  constructor(private hotelService: HotelService) {}

  @ApiOperation({ summary: 'Создание гостиницы' })
  @ApiResponse({ status: 200, type: Hotel })
  @Post()
  create(@Body() hotelDto: CreateHotelDto) {
    return this.hotelService.create(hotelDto);
  }

  @ApiOperation({ summary: 'Поиск гостиницы по ID' })
  @ApiResponse({ status: 200, type: Hotel })
  @Get(':id')
  find(@Param('id') id: string) {
    return this.hotelService.findById(id);
  }

  @ApiOperation({ summary: 'Поиск гостиниц по данным' })
  @ApiResponse({ status: 200, type: [Hotel] })
  @Get()
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'title', required: false })
  search(
    @Query('title') title: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.hotelService.search({
      title,
      limit,
      offset,
    });
  }

  @ApiOperation({ summary: 'Обновление гостиницы по ID' })
  @ApiResponse({ status: 200, type: Hotel })
  @Post('/:id')
  update(@Param('id') id: string, @Body() data: UpdateHotelParams) {
    return this.hotelService.update(id, data);
  }
}
