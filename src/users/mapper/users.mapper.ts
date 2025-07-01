import { User } from '@prisma/client';
import { UserResponseDto } from '../dto/responses/user.response.dto';
import { CreateUserDto } from '../dto/requests/create-user.dto';
import { UpdateUserDto } from '../dto/requests/update-user.dto';


export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponseDtoList(users: User[]): UserResponseDto[] {
    return users.map(user => this.toResponseDto(user));
  }

  static toEntity(dto: CreateUserDto): Omit<User, 'userId' | 'createdAt' | 'updatedAt'> {
    return {
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
  }

  static toUpdateEntity(dto: UpdateUserDto, existing: User): Omit<User, 'userId' | 'createdAt' | 'updatedAt'> {
    return {
      name: dto.name ?? existing.name,
      email: dto.email ?? existing.email,
      password: dto.password ?? existing.password,
    };
  }
}