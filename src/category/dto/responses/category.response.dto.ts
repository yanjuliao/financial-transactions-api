import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  name: string;
}