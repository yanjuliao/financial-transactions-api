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
  private CATEGORY_CREATED_MESSAGE = 'Category created successfully';
  private CATEGORY_DELETED_MESSAGE = 'Category deleted successfully';
  private EMPTY_CATEGORY_LIST_MESSAGE = 'Category list is empty';
  
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
      throw new BadRequestException(this.EMPTY_CATEGORY_LIST_MESSAGE);
    }

    await this.repository.createMany(valid);
    return { message: this.CATEGORY_CREATED_MESSAGE };
  }

  async deleteCategory(categoryId: number): Promise<MessageResponseDto> {
    await this.repository.delete(categoryId);
    return { message: this.CATEGORY_DELETED_MESSAGE };
  }
}
