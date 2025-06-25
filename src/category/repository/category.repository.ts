import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CreateCategoryRequestDto } from '../dto/requests/create-category.request.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor (private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async findById(categoryId: number): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { categoryId } });
  }

  async create(dto: CreateCategoryRequestDto): Promise<Category> {
    return this.prisma.category.create({ data: dto });
  }

  async createMany(dtos: CreateCategoryRequestDto[]): Promise<void> {
    await this.prisma.category.createMany({ data: dtos });
  }

  async delete(categoryId: number): Promise<void> {
    await this.prisma.category.delete({ where: { categoryId } });
  }
}
