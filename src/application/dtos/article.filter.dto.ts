// src/application/dtos/get-unanalysed-article.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ArticleFilterDto {
  @ApiProperty({ description: 'Tag obligatoire pour filtrer les articles' })
  @IsString()
  @IsNotEmpty()
  tag: string;

  @ApiPropertyOptional({
    description: 'Nombre max d’articles à renvoyer',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Ordre de tri sur createdAt',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortPublicationAt?: 'ASC' | 'DESC';
}
