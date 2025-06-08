import { ID } from 'src/types/id.type';
import { Hotel } from '../schemas/hotel.schema';
import { SearchHotelParams } from './search-hotel-params.interface';
import { UpdateHotelParams } from './update-hotel-params.interfaces';

export interface HotelService {
  create(data: any): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}
