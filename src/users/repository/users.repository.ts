import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email} });
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { userId: id } });
    return user;
  }

  async update(id: number, data: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.prisma.user.update({ where: { userId: id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { userId: id } });
  }
}
