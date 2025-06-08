import { ID } from 'src/types/id.type';
import { HotelRoom } from '../schemas/hotel-room.schema';
import { SearchRoomsParams } from './search-rooms-params.interface';

export interface HotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: ID): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
