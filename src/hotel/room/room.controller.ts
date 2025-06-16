import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { UserRole } from 'src/types/user-roles.enum';
import { HotelRoom } from '../schemas/hotel-room.schema';
import { CreateRoomDto } from './dto/create-hotel-room.dto';
import { UpdateRoomDto } from './dto/update-hotel-room.dto copy';
import { HotelRoomService } from './room.service';

@ApiTags('Комнаты')
@Controller('hotel/room')
export class HotelRoomController {
  constructor(private hotelRoomService: HotelRoomService) {}

  @ApiOperation({ summary: 'Создание комнаты' })
  @ApiResponse({ status: 200, type: HotelRoom })
  @Auth(UserRole.ADMIN)
  @Post('/create')
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() roomDto: CreateRoomDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.hotelRoomService.create(roomDto, images);
  }

  @ApiOperation({ summary: 'Поиск комнаты по ID' })
  @ApiResponse({ status: 200, type: HotelRoom })
  @Get('/search/:id')
  find(@Param('id') id: string) {
    return this.hotelRoomService.findById(id);
  }

  @ApiOperation({ summary: 'Поиск комнаты по данным' })
  @ApiResponse({ status: 200, type: [HotelRoom] })
  @Get('/search')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'hotel', required: true })
  @ApiQuery({ name: 'isEnabled', required: false })
  search(
    @Query('hotel') hotel: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('isEnabled') isEnabled?: boolean,
  ) {
    return this.hotelRoomService.search({
      hotel,
      limit,
      offset,
      isEnabled,
    });
  }

  @ApiOperation({ summary: 'Обновление комнаты по ID' })
  @ApiResponse({ status: 200, type: HotelRoom })
  @Auth(UserRole.ADMIN)
  @Post('update/:id')
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @Param('id') id: string,
    @Body() data: UpdateRoomDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.hotelRoomService.update(id, data, images);
  }
}
