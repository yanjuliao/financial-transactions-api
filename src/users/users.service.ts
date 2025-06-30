import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { UsersRepository } from './users.repository';
import { UserMapper } from './mapper/users.mapper';
import { UserResponseDto } from './dto/responses/user.response.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(data.senha, 10);
    const entity = UserMapper.toEntity({ ...data, senha: hashedPassword });
    const user = await this.repository.create(entity);
    return UserMapper.toResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.repository.findAll();
    return users.map(UserMapper.toResponseDto);
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findByEmail(email);
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.repository.findById(id);
    return UserMapper.toResponseDto(user);
  }

  async update(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    const foundEntity = await this.repository.findById(id);
    if (!foundEntity) throw new NotFoundException('Usuário não encontrado');

    const entityToUpdate = UserMapper.toUpdateEntity(data, foundEntity);
    const updated = await this.repository.update(id, entityToUpdate);
    return UserMapper.toResponseDto(updated);
  }

  async delete(id: number): Promise<void> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.repository.delete(id);
  }
}
