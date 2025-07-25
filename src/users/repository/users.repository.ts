import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email} });
  }

  async findUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { userId: id } });
    return user;
  }

  async updateUser(id: number, data: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.prisma.user.update({ where: { userId: id }, data });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { userId: id } });
  }
}
