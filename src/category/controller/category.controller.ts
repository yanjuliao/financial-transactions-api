import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCategoryRequestDto } from '../dto/requests/create-category.request.dto';
import { CreateManyCategoryRequestDto } from '../dto/requests/create-many-category.request.dto';
import { CategoryResponseDto } from '../dto/responses/category.response.dto';
import { MessageResponseDto } from '../dto/responses/message.response.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Categories')
@ApiBearerAuth('jwt-auth')
@Roles('ADMIN')
@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Roles('USER')
  @Get()
  @ApiOperation({ summary: 'List all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
    type: [CategoryResponseDto],
  })
  getAllCategories(): Promise<CategoryResponseDto[]> {
    return this.service.getAllCategories();
  }

  @Roles('USER')
  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category found',
    type: CategoryResponseDto,
  })
  getById(@Param('id') categoryId: number): Promise<CategoryResponseDto> {
    return this.service.getCategoryById(Number(categoryId));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  create(@Body() dto: CreateCategoryRequestDto): Promise<CategoryResponseDto> {
    return this.service.createCategory(dto);
  }

  @Post('many')
  @ApiOperation({ summary: 'Create multiple categories' })
  createMany(@Body() dto: CreateManyCategoryRequestDto) {
    return this.service.createManyCategories(dto.categories);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    type: MessageResponseDto,
  })
  delete(@Param('id') categoryId: number): Promise<MessageResponseDto> {
    return this.service.deleteCategory(categoryId);
  }
}
