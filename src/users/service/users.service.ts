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

@Injectable()
export class UsersService {
  private USER_NOT_FOUND_MESSAGE = 'user_not_found';
  private HAS_TRANSACTIONS_MESSAGE =
    'user_has_transactions';
  private EMAIL_IN_USE_MESSAGE = 'email_already_in_use';
  private INVALID_CREDENTIALS_MESSAGE = 'invalid_username_or_password';

  constructor(
    private readonly repository: UsersRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const storedUser = await this.repository.findByEmail(data.email);
    if (storedUser) {
      throw new BadRequestException(this.EMAIL_IN_USE_MESSAGE);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const entity = UserMapper.toCreateEntity({
      ...data,
      password: hashedPassword,
      role: 'USER',
    });

    const user = await this.repository.create(entity);
    return UserMapper.toResponseDto(user);
  }

  async createAdmin(): Promise<User> {
    const adminUser = await this.repository.findByEmail(process.env.ADMIN_EMAIL!);
    if (!adminUser) {
      const createUserAdminDto = this.buildAdminUserDto();
      const hashedPassword = await bcrypt.hash(createUserAdminDto.password, 10);
      const entity = UserMapper.toCreateEntity({
        ...createUserAdminDto,
        password: hashedPassword,
      });
      const userAdmin = await this.repository.create(entity);
      return UserMapper.toResponseDto(userAdmin);
    }
    return UserMapper.toResponseDto(adminUser);
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

  async findById(id: number): Promise<UserResponseDto> {
    const foundUser = await this.repository.findById(id);
    if (!foundUser) throw new NotFoundException(this.USER_NOT_FOUND_MESSAGE);
    return UserMapper.toResponseDto(foundUser);
  }

  async update(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    const foundEntity = await this.findById(id);
    let updatedData = { ...data };
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updatedData.password = hashedPassword;
    }
    const entityToUpdate = UserMapper.toUpdateEntity(updatedData, foundEntity);
    const updated = await this.repository.update(id, entityToUpdate);
    return UserMapper.toResponseDto(updated);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    const hasTransactions =
      await this.transactionService.hasUserTransactions(id);
    if (hasTransactions) {
      throw new BadRequestException(this.HAS_TRANSACTIONS_MESSAGE);
    }
    return this.repository.delete(id);
  }

  buildAdminUserDto(): CreateUserDto {
    return {
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
      role: 'ADMIN',
    };
  }
}
