// src/application/dtos/article.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ArticleStateDto {
  @ApiProperty({
    description: 'Indicates if the article has been read.',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isRead: boolean;

  @ApiProperty({
    description: 'Indicates if the article is marked as a favorite.',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isFavorite: boolean;

  @ApiProperty({
    description: 'Indicates if the article is archived.',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isArchived: boolean;

  @ApiProperty({
    description: 'Indicates if the article is saved.',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isSaved: boolean;
}
