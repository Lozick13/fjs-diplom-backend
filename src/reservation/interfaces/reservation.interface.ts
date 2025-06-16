import { ID } from 'src/types/id.type';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { ReservationSearchOptionsDto } from '../dto/reservation-search-options.dto';
import { Reservation } from '../schemas/reservation.schema';

export interface IReservation {
  addReservation(data: CreateReservationDto): Promise<Reservation>;
  removeReservation(id: ID): Promise<void>;
  getReservations(
    filter: ReservationSearchOptionsDto,
  ): Promise<Array<Reservation>>;
}
