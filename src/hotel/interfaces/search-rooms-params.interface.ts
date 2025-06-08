import { ID } from 'src/types/id.type';

export interface SearchRoomsParams {
  limit?: number;
  offset?: number;
  hotel: ID;
  isEnabled?: boolean;
}
