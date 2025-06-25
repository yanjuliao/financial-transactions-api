import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';
import { CategoryMapper } from '../mapper/category.mapper';
import { CreateCategoryRequestDto } from '../dto/requests/create-category.request.dto';
import { CategoryResponseDto } from '../dto/responses/category.response.dto';
import { MessageResponseDto } from '../dto/responses/message.response.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async getAllCategories(): Promise<CategoryResponseDto[]> {
    const result = await this.repository.findAll();
    return CategoryMapper.toResponseDtoList(result);
  }

  async getCategoryById(categoryId: number): Promise<CategoryResponseDto> {
    const category = await this.repository.findById(categoryId);
    if (!category) throw new NotFoundException();
    return CategoryMapper.toResponseDto(category);
  }

  async createCategory(
    dto: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const created = await this.repository.create(dto);
    return CategoryMapper.toResponseDto(created);
  }

  async createManyCategories(dtos: CreateCategoryRequestDto[]) {
    const valid = dtos.filter(
      (c) => c && typeof c.name === 'string' && c.name.trim() !== '',
    );
    if (valid.length === 0) {
      throw new BadRequestException('Envie ao menos uma categoria válida.');
    }

    await this.repository.createMany(valid);
    return { message: 'Categorias criadas com sucesso' };
  }

  async deleteCategory(categoryId: number): Promise<MessageResponseDto> {
    await this.repository.delete(categoryId);
    return { message: 'Categoria deletada com sucesso' };
  }
}
