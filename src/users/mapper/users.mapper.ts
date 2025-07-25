import { User } from '@prisma/client';
import { UserResponseDto } from '../dto/responses/user.response.dto';
import { CreateUserDto } from '../dto/requests/create-user.dto';
import { UpdateUserDto } from '../dto/requests/update-user.dto';
import { CreateUserAdminDto } from '../dto/requests/create-user-admin.dto';
import { UpdateUserAdminDto } from '../dto/requests/update-user-admin.dto';


export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role
    };
  }

  static toResponseDtoList(users: User[]): UserResponseDto[] {
    return users.map(user => this.toResponseDto(user));
  }

  static toCreateEntity(dto: CreateUserDto): Omit<User, 'userId' | 'createdAt' | 'updatedAt'> {
    return {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: 'USER',
    };
  }

  static toCreateAdminEntity(dto: CreateUserAdminDto): Omit<User, 'userId' | 'createdAt' | 'updatedAt'> {
    return {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
    };
  }

  static toUpdateEntity(dto: UpdateUserDto, existing: User): Omit<User, 'userId' | 'createdAt' | 'updatedAt'> {
    return {
      name: dto.name ?? existing.name,
      email: dto.email ?? existing.email,
      password: dto.password ?? existing.password,
      role: existing.role,
    };
  }

  static toUpdateAdminEntity(dto: UpdateUserAdminDto, existing: User): Omit<User, 'userId' | 'createdAt' | 'updatedAt'> {
    return {
      name: dto.name ?? existing.name,
      email: dto.email ?? existing.email,
      password: dto.password ?? existing.password,
      role: dto.role ?? existing.role,
    };
  }
}