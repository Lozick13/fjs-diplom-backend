import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(
    user: User,
    done: (err: Error | null, user: User) => void,
  ): void {
    done(null, user);
  }

  deserializeUser(
    payload: string,
    done: (err: Error | null, payload: string) => void,
  ): void {
    done(null, payload);
  }
}
