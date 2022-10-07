import { User } from './../../../mongoose/User.entity';
import { UserResponse } from './../../dtos/user-response.dto';
import { CreateUserRequest } from './../../dtos/create-user-request.dto';
import { UsersRepository } from './../../users.repository';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(
    createUserRequest: CreateUserRequest,
  ): Promise<UserResponse> {
    await this.validateCreateUserRequest(createUserRequest);

    const { password } = createUserRequest;

    const salt = await bcrypt.genSalt();
    const hashedPw = await bcrypt.hash(password, salt);

    const user = await this.usersRepository.insertOne({
      ...createUserRequest,
      password: hashedPw,
    });

    return this.buildResponse(user);
  }

  async getUserById(userId: string): Promise<UserResponse> {
    const user = await this.usersRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User with that id does not exist');
    }

    return this.buildResponse(user);
  }

  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User with that email does not exist');
    }

    const areEqualPasswords = await bcrypt.compare(password, user.password);

    if (!areEqualPasswords) {
      throw new UnauthorizedException('Credentials are invalid');
    }

    return this.buildResponse(user);
  }

  private buildResponse(user: User): UserResponse {
    return {
      _id: user._id,
      email: user.email,
    };
  }

  private async validateCreateUserRequest(
    createUserRequest: CreateUserRequest,
  ) {
    const user = this.usersRepository.findOneByEmail(createUserRequest.email);

    if (user) {
      throw new UnauthorizedException('User already exists with that email');
    }
  }
}
