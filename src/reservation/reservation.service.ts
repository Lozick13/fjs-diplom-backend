import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ID } from 'src/types/id.type';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationSearchOptionsDto } from './dto/reservation-search-options.dto';
import { IReservation } from './interfaces/reservation.interface';
import { Reservation } from './schemas/reservation.schema';

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
  ) {}

  private validateDates(dateStart: Date, dateEnd: Date): void {
    if (!dateStart || !dateEnd) {
      throw new BadRequestException('Необходимо указать обе даты');
    }

    if (dateStart >= dateEnd) {
      throw new BadRequestException(
        'Дата окончания должна быть позже даты начала',
      );
    }

    if (dateStart < new Date()) {
      throw new BadRequestException('Дата начала не может быть в прошлом');
    }
  }

  async addReservation(data: CreateReservationDto): Promise<Reservation> {
    this.validateDates(data.dateStart, data.dateEnd);

    const roomReservations = await this.reservationModel
      .find({
        roomId: data.roomId,
        $or: [
          {
            dateStart: { $lt: data.dateEnd },
            dateEnd: { $gt: data.dateStart },
          },
        ],
      })
      .exec();
    if (roomReservations.length > 0)
      throw new BadRequestException('Выбранные даты уже заняты');

    const reservation = new this.reservationModel({ ...data });
    return reservation.save();
  }

  async removeReservation(id: ID): Promise<void> {
    const result = await this.reservationModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Бронирование с указанным ID не найдено');
    }
  }

  async getReservations(
    filter: ReservationSearchOptionsDto,
  ): Promise<Reservation[]> {
    const { userId, dateStart, dateEnd } = filter;
    const query: FilterQuery<ReservationSearchOptionsDto> = { userId };

    if (dateStart && dateEnd) this.validateDates(dateStart, dateEnd);
    if (dateStart) query.dateStart = { $gte: new Date(dateStart) };
    if (dateEnd) query.dateEnd = { $lte: new Date(dateEnd) };

    return await this.reservationModel.find(query).exec();
  }

  async getReservationById(id: ID): Promise<Reservation | null> {
    return await this.reservationModel.findById(id).exec();
  }
}
