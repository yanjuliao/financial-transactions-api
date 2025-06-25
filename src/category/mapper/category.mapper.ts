import { Category } from '@prisma/client';
import { CategoryResponseDto } from '../dto/responses/category.response.dto';


export class CategoryMapper {
  static toResponseDto(model: Category): CategoryResponseDto {
    return {
      categoryId: model.categoryId,
      name: model.name,
    };
  }

  static toResponseDtoList(models: Category[]): CategoryResponseDto[] {
    return models.map(this.toResponseDto);
  }
}