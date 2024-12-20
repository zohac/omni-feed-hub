// src/application/dtos/article.tag.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ArticleTagDto {
  @ApiProperty({
    description: 'The unique identifier for the tag.',
    example: 'tag1',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'The label for the tag.',
    example: 'Technology',
  })
  @IsString()
  @IsNotEmpty()
  label: string;
}
