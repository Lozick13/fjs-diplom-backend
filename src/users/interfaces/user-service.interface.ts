import { ID } from 'src/types/id.type';
import { User } from '../schemas/user.schema';
import { SearchUserParams } from './search-user-params.interface';

export interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: ID): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}
