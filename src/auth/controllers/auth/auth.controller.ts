import { UserResponse } from './../../../users/dtos/user-response.dto';
import { LocalAuthGuard } from './../../guards/local-auth.guard';
import { AuthService } from './../../services/auth/auth.service';
import { Controller, Get, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/get-current-user.decorator';
import { User } from 'src/mongoose/User.entity';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.login(user, response);
    response.send(user);
  }

  @Get()
  async getUser(@CurrentUser() user: UserResponse) {
    return user;
  }
}
