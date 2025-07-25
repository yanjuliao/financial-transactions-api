import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ForbiddenException,
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
  private CANNOT_CREATE_ADMIN_MESSAGE = 'you_are_not_authorized_to_create_an_admin_user.';

  constructor(
    private readonly repository: UsersRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async createUserRegular(data: CreateUserDto): Promise<UserResponseDto> {
    const storedUser = await this.repository.findUserByEmail(data.email);
    if (storedUser) {
      throw new BadRequestException(this.EMAIL_IN_USE_MESSAGE);
    }
    return this.create({ ...data });
  }

  async createUserAdmin(): Promise<UserResponseDto> {
    const adminDto = this.buildAdminUserDto();
    const storedUser = await this.repository.findUserByEmail(adminDto.email);
    if (storedUser) {
      return UserMapper.toResponseDto(storedUser);
    }
    return this.create(adminDto);
  }

  validateCreate(dto: CreateUserDto, role: RoleType): void {
    if (role !== RoleType.ADMIN && dto.role === RoleType.ADMIN) {
      throw new ForbiddenException(this.CANNOT_CREATE_ADMIN_MESSAGE);
    }
  }

  private async create(data: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const entity = UserMapper.toCreateEntity({
      ...data,
      password: hashedPassword,
    });
    const user = await this.repository.createUser(entity);

    return UserMapper.toResponseDto(user);
  }

  async findUsers(): Promise<UserResponseDto[]> {
    const users = await this.repository.findUsers();
    return users.map(UserMapper.toResponseDto);
  }

  async findUserByEmailValidation(email: string) {
    if (!email) {
      throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
    }

    return await this.findUserByEmail(email);
  }

  async findUserByEmail(email: string): Promise<User> {
    const foundUser = await this.repository.findUserByEmail(email);
    if (!foundUser) throw new NotFoundException(this.USER_NOT_FOUND_MESSAGE);
    return foundUser;
  }

  async findUserEntityById(id: number): Promise<User> {
    const user = await this.repository.findUserById(id);
    if (!user) throw new NotFoundException(this.USER_NOT_FOUND_MESSAGE);
    return user;
  }

  async findUserById(id: number): Promise<UserResponseDto> {
    const user = await this.findUserEntityById(id);
    return UserMapper.toResponseDto(user);
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    const foundEntity = await this.findUserEntityById(id);
    const updatedData: Partial<User> = { ...data };
    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }
    const entityToUpdate = UserMapper.toUpdateEntity(updatedData, foundEntity);
    const updated = await this.repository.updateUser(id, entityToUpdate);
    return UserMapper.toResponseDto(updated);
  }

  async deleteUser(id: number): Promise<void> {
    await this.findUserEntityById(id);
    const hasTransactions =
      await this.transactionService.hasUserTransactions(id);
    if (hasTransactions) {
      throw new BadRequestException(this.HAS_TRANSACTIONS_MESSAGE);
    }
    await this.repository.deleteUser(id);
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
