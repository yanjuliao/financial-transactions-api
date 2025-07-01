import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/requests/create-user.dto';
import { UpdateUserDto } from '../dto/requests/update-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { UserMapper } from '../mapper/users.mapper';
import { UserResponseDto } from '../dto/responses/user.response.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  private USER_NOT_FOUND_MESSAGE = 'User not found';

  constructor(private readonly repository: UsersRepository) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const entity = UserMapper.toEntity({ ...data, password: hashedPassword });
    const user = await this.repository.create(entity);
    return UserMapper.toResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.repository.findAll();
    return users.map(UserMapper.toResponseDto);
  }

  async findByEmail(email: string): Promise<User> {
     const foundUser = await this.repository.findByEmail(email);
     if (!foundUser) throw new NotFoundException(this.USER_NOT_FOUND_MESSAGE);
     return foundUser;
  }

  async findById(id: number): Promise<UserResponseDto> {
    const foundUser = await this.repository.findById(id);
    if (!foundUser) throw new NotFoundException(this.USER_NOT_FOUND_MESSAGE);
    return UserMapper.toResponseDto(foundUser);
  }

  async update(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    const foundEntity = await this.repository.findById(id);
    if (!foundEntity) throw new NotFoundException(this.USER_NOT_FOUND_MESSAGE);

    const entityToUpdate = UserMapper.toUpdateEntity(data, foundEntity);
    const updated = await this.repository.update(id, entityToUpdate);
    return UserMapper.toResponseDto(updated);
  }

  async delete(id: number): Promise<void> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundException(this.USER_NOT_FOUND_MESSAGE);
    return this.repository.delete(id);
  }
}
