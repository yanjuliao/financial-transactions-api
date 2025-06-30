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

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { email} });
    if (!user) throw new NotFoundException(`Usuário ${email} não encontrado`);
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { userId: id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, data: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.prisma.user.update({ where: { userId: id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { userId: id } });
  }
}
