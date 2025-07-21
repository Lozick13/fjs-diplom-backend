import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { isValidObjectId, Model } from 'mongoose';
import { ID } from 'src/types/id.type';
import { UserRole } from 'src/types/user-roles.enum';
import { validateEmail } from 'src/utils/validation';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserParams } from './interfaces/search-user-params.interface';
import { IUserService } from './interfaces/user-service.interface';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: CreateUserDto): Promise<User> {
    if (!Object.values(UserRole).includes(data.role)) {
      throw new BadRequestException('Указана недопустимая роль пользователя');
    }

    const normalizedEmail = data.email.toLowerCase().trim();
    const existingUser = await this.userModel.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') },
    });

    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким email уже зарегистрирован',
      );
    }

    const hash = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({
      ...data,
      email: normalizedEmail,
      passwordHash: hash,
    });
    return user.save();
  }

  async findById(id: ID): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Неверный формат ID');
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    if (!validateEmail(email)) {
      throw new BadRequestException('Некорректный формат email');
    }

    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findAll(params: SearchUserParams): Promise<User[]> {
    const {
      limit = 10,
      offset = 0,
      email = '',
      name = '',
      contactPhone = '',
    } = params;

    return this.userModel
      .find({
        $and: [
          { email: { $regex: email, $options: 'i' } },
          { name: { $regex: name, $options: 'i' } },
          { contactPhone: { $regex: contactPhone, $options: 'i' } },
        ],
      })
      .skip(offset)
      .limit(limit);
  }
}
