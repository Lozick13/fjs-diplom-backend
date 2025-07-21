import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { ID } from 'src/types/id.type';
import { IHotelRoomService } from '../interfaces/hotel-room-service.interface';
import { SearchRoomsParams } from '../interfaces/search-rooms-params.interface';
import { HotelRoom } from '../schemas/hotel-room.schema';
import { Hotel } from '../schemas/hotel.schema';
import { CreateRoomDto } from './dto/create-hotel-room.dto';
import { UpdateRoomDto } from './dto/update-hotel-room.dto copy';

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoom>,
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    private fileService: FilesService,
  ) {}

  async create(
    data: CreateRoomDto,
    images: Express.Multer.File[],
  ): Promise<HotelRoom> {
    if (!images || !images.length) {
      throw new BadRequestException(
        'Необходимо загрузить хотя бы одно изображение',
      );
    }
    try {
      const hotel = await this.hotelModel.findById(data.hotel);
      if (!hotel) throw new NotFoundException('Такого отеля нет');
    } catch (error: unknown) {
      if (error instanceof Error)
        console.log('Отель не найден:', error.message);
      else console.log('Произошла неизвестная ошибка');

      throw new NotFoundException('Такого отеля нет');
    }

    const filesName: string[] = await Promise.all(
      images.map((image) => this.fileService.createFile(image)),
    );

    const room = new this.hotelRoomModel({ ...data, images: filesName });
    return room.save();
  }

  async findById(id: ID): Promise<HotelRoom> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Неверный формат ID');
    }
    const room = await this.hotelRoomModel.findById(id).exec();
    if (!room) {
      throw new NotFoundException('Комната не найдена');
    }
    return room;
  }

  async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    const { limit = 10, offset = 0, hotel, isEnabled } = params;
    const query: FilterQuery<HotelRoom> = {};

    if (hotel) query.hotel = { $regex: hotel, $options: 'i' };
    if (typeof isEnabled === 'boolean') query.isEnabled = isEnabled;

    return this.hotelRoomModel.find(query).skip(offset).limit(limit);
  }

  async update(
    id: ID,
    data: UpdateRoomDto,
    images: Express.Multer.File[],
  ): Promise<HotelRoom> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Неверный формат ID');
    }
    if (!images || !images.length) {
      throw new BadRequestException(
        'Необходимо загрузить хотя бы одно изображение',
      );
    }
    try {
      const hotel = await this.hotelModel.findById(data.hotel);
      if (!hotel) throw new NotFoundException('Такого отеля нет');
    } catch (error: unknown) {
      if (error instanceof Error)
        console.log('Отель не найден:', error.message);
      else console.log('Произошла неизвестная ошибка');

      throw new NotFoundException('Такого отеля нет');
    }

    const filesName: string[] = await Promise.all(
      images.map((image) => this.fileService.createFile(image)),
    );

    const updatedRoom = await this.hotelRoomModel
      .findByIdAndUpdate(
        id,
        { $set: { ...data, images: filesName } },
        { new: true },
      )
      .exec();
    if (!updatedRoom) {
      throw new NotFoundException('Гостиница не найдена');
    }
    return updatedRoom;
  }
}
