import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersRepository } from '../repositories/users.repository';
import { UserResponseDto } from 'src/auth/dto/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async findOneByEmail(email: string) {
    return this.repository.findUnique({ email });
  }

  async findOneById(id: number) {
    return this.repository.findUnique({ id });
  }

  async create(data: Prisma.UserCreateInput): Promise<UserResponseDto> {
    const user = await this.repository.create(data);
    return UserMapper.toResponseDto(user);
  }
}
