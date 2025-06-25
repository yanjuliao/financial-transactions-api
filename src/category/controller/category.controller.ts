import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryRequestDto } from '../dto/requests/create-category.request.dto';
import { CreateManyCategoryRequestDto } from '../dto/requests/create-many-category.request.dto';
import { CategoryResponseDto } from '../dto/responses/category.response.dto';
import { MessageResponseDto } from '../dto/responses/message.response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias',
    type: [CategoryResponseDto],
  })
  getAllCategories(): Promise<CategoryResponseDto[]> {
    return this.service.getAllCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada',
    type: CategoryResponseDto,
  })
  getById(@Param('id') categoryId: number): Promise<CategoryResponseDto> {
    return this.service.getCategoryById(categoryId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada',
    type: CategoryResponseDto,
  })
  create(@Body() dto: CreateCategoryRequestDto): Promise<CategoryResponseDto> {
    return this.service.createCategory(dto);
  }

  @Post('many')
  @ApiOperation({ summary: 'Criar várias categorias' })
  createMany(@Body() dto: CreateManyCategoryRequestDto) {
    return this.service.createManyCategories(dto.categories);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria deletada com sucesso',
    type: MessageResponseDto,
  })
  delete(@Param('id') categoryId: number): Promise<MessageResponseDto> {
    return this.service.deleteCategory(categoryId);
  }
}
