import { ID } from 'src/types/id.type';
import { Reservation } from '../schemas/reservation.schema';
import { ReservationDto } from './reservation-dto.interface';
import { ReservationSearchOptions } from './reservation-search-options.interface';

export interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: ID): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
