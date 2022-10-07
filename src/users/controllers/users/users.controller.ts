import { UserResponse } from './../../dtos/user-response.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserRequest } from 'src/users/dtos/create-user-request.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  signUp(@Body() createUserRequest: CreateUserRequest): Promise<UserResponse> {
    return this.usersService.createUser(createUserRequest);
  }
}
