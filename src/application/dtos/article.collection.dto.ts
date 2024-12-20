// src/application/dtos/article.collection.dto.ts

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleCollectionDto {
  @ApiProperty({ description: 'Name of the Article Collection' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Description of the Article Collection' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateArticleCollectionDto extends PartialType(
  CreateArticleCollectionDto,
) {}
