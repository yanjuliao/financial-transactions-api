import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoryRequestDto } from './create-category.request.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateManyCategoryRequestDto {
  @ApiProperty({ type: [CreateCategoryRequestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryRequestDto)
  categories: CreateCategoryRequestDto[];
}