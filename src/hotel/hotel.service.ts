import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ID } from 'src/types/id.type';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { IHotelService } from './interfaces/hotel-service.interface';
import { SearchHotelParams } from './interfaces/search-hotel-params.interface';
import { UpdateHotelParams } from './interfaces/update-hotel-params.interfaces';
import { Hotel } from './schemas/hotel.schema';

@Injectable()
export class HotelService implements IHotelService {
  constructor(@InjectModel(Hotel.name) private hotelModel: Model<Hotel>) {}

  async create(data: CreateHotelDto): Promise<Hotel> {
    const existingHotel = await this.hotelModel.findOne({
      title: { $regex: new RegExp(`^${data.title}$`, 'i') },
    });

    if (existingHotel) {
      throw new ConflictException('Гостиница с таким названием уже существует');
    }

    const hotel = new this.hotelModel({ ...data });
    return hotel.save();
  }

  async findById(id: ID): Promise<Hotel> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Неверный формат ID');
    }
    const hotel = await this.hotelModel.findById(id).exec();
    if (!hotel) {
      throw new NotFoundException('Гостиница не найдена');
    }
    return hotel;
  }

  async search(params: SearchHotelParams): Promise<Hotel[]> {
    const { limit = 10, offset = 0, title = '' } = params;

    return this.hotelModel
      .find({
        $and: [{ title: { $regex: title, $options: 'i' } }],
      })
      .skip(offset)
      .limit(limit);
  }

  async update(id: ID, data: UpdateHotelParams): Promise<Hotel> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Неверный формат ID');
    }

    if (data.title) {
      const existingHotel = await this.hotelModel.findOne({
        _id: { $ne: id },
        title: { $regex: new RegExp(`^${data.title}$`, 'i') },
      });

      if (existingHotel) {
        throw new ConflictException(
          'Гостиница с таким названием уже существует',
        );
      }
    }

    const updatedHotel = await this.hotelModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
    if (!updatedHotel) {
      throw new NotFoundException('Гостиница не найдена');
    }
    return updatedHotel;
  }
}
