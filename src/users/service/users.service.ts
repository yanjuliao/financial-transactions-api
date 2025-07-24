import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/requests/create-user.dto';
import { UpdateUserDto } from '../dto/requests/update-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { UserMapper } from '../mapper/users.mapper';
import { UserResponseDto } from '../dto/responses/user.response.dto';
import { User } from '@prisma/client';
import { TransactionService } from 'src/transaction/service/transaction.service';
import { RoleType } from '../enum';

@Injectable()
export class UsersService {
  private USER_NOT_FOUND_MESSAGE = 'user_not_found';
  private HAS_TRANSACTIONS_MESSAGE = 'user_has_transactions';
  private EMAIL_IN_USE_MESSAGE = 'email_already_in_use';
  private INVALID_CREDENTIALS_MESSAGE = 'invalid_username_or_password';

  constructor(
    private readonly repository: UsersRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    return this.createIfEmailNotExists({ ...data }, true);
  }

  async createAdmin(): Promise<UserResponseDto> {
    const adminDto = this.buildAdminUserDto();
    return this.createIfEmailNotExists(adminDto, false);
  }

  private async createIfEmailNotExists(
    data: CreateUserDto,
    throwIfExists: boolean,
  ): Promise<UserResponseDto> {
    const storedUser = await this.repository.findByEmail(data.email);

    if (storedUser) {
      if (throwIfExists) {
        throw new BadRequestException(this.EMAIL_IN_USE_MESSAGE);
      }
      return UserMapper.toResponseDto(storedUser);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const entity = UserMapper.toCreateEntity({
      ...data,
      password: hashedPassword,
    });
    const user = await this.repository.create(entity);

    return UserMapper.toResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.repository.findAll();
    return users.map(UserMapper.toResponseDto);
  }

  async findByEmailValidation(email: string) {
    if (!email) {
      throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
    }

    return await this.findByEmail(email);
  }

  async findByEmail(email: string): Promise<User> {
    const foundUser = await this.repository.findByEmail(email);
    if (!foundUser) throw new NotFoundException(this.USER_NOT_FOUND_MESSAGE);
    return foundUser;
  }

  async findEntityById(id: number): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundException(this.USER_NOT_FOUND_MESSAGE);
    return user;
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.findEntityById(id);
    return UserMapper.toResponseDto(user);
  }

  async update(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    const foundEntity = await this.findEntityById(id);
    const updatedData: Partial<User> = { ...data };
    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }
    const entityToUpdate = UserMapper.toUpdateEntity(updatedData, foundEntity);
    const updated = await this.repository.update(id, entityToUpdate);
    return UserMapper.toResponseDto(updated);
  }

  async delete(id: number): Promise<void> {
    await this.findEntityById(id);
    const hasTransactions =
      await this.transactionService.hasUserTransactions(id);
    if (hasTransactions) {
      throw new BadRequestException(this.HAS_TRANSACTIONS_MESSAGE);
    }
    await this.repository.delete(id);
  }

  buildAdminUserDto(): CreateUserDto {
    return {
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
      role: RoleType.ADMIN,
    };
  }
}
