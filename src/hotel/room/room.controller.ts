import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { ID } from 'src/types/id.type';
import { UserRole } from 'src/types/user-roles.enum';
import { HotelService } from '../hotel.service';
import { HotelRoom } from '../schemas/hotel-room.schema';
import { CreateRoomDto } from './dto/create-hotel-room.dto';
import { UpdateRoomDto } from './dto/update-hotel-room.dto copy';
import { HotelRoomService } from './room.service';

@ApiTags('Комнаты')
@Controller('')
export class HotelRoomController {
  constructor(
    private hotelRoomService: HotelRoomService,
    private hotelService: HotelService,
  ) {}

  private mapToRoomResponseDto(
    room: HotelRoom,
    hotel?: { title?: string; description?: string } | null,
    isEnabled?: boolean,
  ) {
    const result: Record<string, any> = {
      id: room._id,
      description: room.description,
      images: room.images || [],
    };

    if (isEnabled) {
      result.isEnabled = true;
    }

    if (room.hotel) {
      result.hotel = {
        id: room.hotel.toString(),
        title: hotel?.title || '',
        description: hotel?.description || '',
      };
    }

    return result;
  }

  @ApiOperation({ summary: 'Поиск комнаты по ID' })
  @ApiResponse({ status: 200 })
  @Get('common/hotel-rooms/:id')
  async find(@Param('id') id: string) {
    const room = await this.hotelRoomService.findById(id);
    const hotel = room.hotel
      ? await this.hotelService.findById(room.hotel.toString() as ID)
      : null;

    return this.mapToRoomResponseDto(room, hotel);
  }

  @ApiOperation({ summary: 'Поиск комнаты по параметрам' })
  @ApiResponse({ status: 200 })
  @Get('common/hotel-rooms')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'hotel', required: true })
  @ApiQuery({ name: 'isEnabled', required: false })
  async search(
    @Query('hotel') hotel: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('isEnabled') isEnabled?: boolean,
  ) {
    const rooms = await this.hotelRoomService.search({
      hotel,
      limit,
      offset,
      isEnabled,
    });

    const hotelIds = [
      ...new Set(
        rooms.map((room) => room.hotel).filter((hotelId) => !!hotelId),
      ),
    ];
    const hotels = await Promise.all(
      hotelIds.map(async (id) => {
        try {
          const hotel = await this.hotelService.findById(id.toString() as ID);
          return {
            id,
            title: hotel?.title || '',
            description: hotel?.description || '',
          };
        } catch {
          return { id, title: '', description: '' };
        }
      }),
    );
    const hotelMap = new Map(hotels.map((hotel) => [hotel.id, hotel]));

    return rooms.map((room) =>
      this.mapToRoomResponseDto(room, hotelMap.get(room.hotel)),
    );
  }

  @ApiOperation({ summary: 'Создание комнаты' })
  @ApiResponse({ status: 201 })
  @Auth(UserRole.ADMIN)
  @Post('admin/hotel-rooms')
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() roomDto: CreateRoomDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const room = await this.hotelRoomService.create(roomDto, images);
    const hotel = room.hotel
      ? await this.hotelService.findById(room.hotel.toString() as ID)
      : null;

    return this.mapToRoomResponseDto(room, hotel);
  }

  @ApiOperation({ summary: 'Обновление комнаты по ID' })
  @ApiResponse({ status: 200, type: HotelRoom })
  @Auth(UserRole.ADMIN)
  @Put('admin/hotel-rooms/:id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() data: UpdateRoomDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const room = await this.hotelRoomService.update(id, data, images);
    const hotel = room.hotel
      ? await this.hotelService.findById(room.hotel.toString() as ID)
      : null;

    return this.mapToRoomResponseDto(room, hotel);
  }
}
