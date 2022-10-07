import { UserResponse } from './../../users/dtos/user-response.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Inject } from '@nestjs/common';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserResponse> {
    return this.usersService.validateUser(email, password);
  }
}
