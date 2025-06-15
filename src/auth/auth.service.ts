import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{
    email: string;
    name: string;
    contactPhone: string;
    role: string;
  } | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Почта или пароль не верны');
    }

    const passwordHash = await bcrypt.compare(password, user.passwordHash);
    if (!passwordHash) {
      throw new UnauthorizedException('Почта или пароль не верны');
    }

    if (user && passwordHash) {
      return {
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
        role: user.role,
      };
    }
    return null;
  }
}
