import { ID } from 'src/types/id.type';
import { CreateRoomDto } from '../room/dto/create-hotel-room.dto';
import { UpdateRoomDto } from '../room/dto/update-hotel-room.dto copy';
import { HotelRoom } from '../schemas/hotel-room.schema';
import { SearchRoomsParams } from './search-rooms-params.interface';

export interface IHotelRoomService {
  create(
    data: CreateRoomDto,
    images: Express.Multer.File[],
  ): Promise<HotelRoom>;
  findById(id: ID): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(
    id: ID,
    data: UpdateRoomDto,
    images: Express.Multer.File[],
  ): Promise<HotelRoom>;
}
