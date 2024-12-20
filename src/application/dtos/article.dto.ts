// src/application/dtos/article.dto.ts

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ArticleStateDto } from './article.state.dto';
import { ArticleTagDto } from './article.tag.dto';
import { MediaAttachmentDto } from './media.attachement.dto';

export class CreateArticleDto {
  @ApiProperty({
    description: 'The title of the article.',
    example: 'Sample Article',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The state of the article.',
    type: ArticleStateDto,
  })
  @ValidateNested()
  @Type(() => ArticleStateDto)
  @IsNotEmpty()
  state: ArticleStateDto;

  @ApiPropertyOptional({
    description: 'The link to the article.',
    example: 'https://example.com/article',
  })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({
    description: 'The description of the article.',
    example: 'A brief description of the article.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'The content of the article.',
    example: 'Detailed content of the article.',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Media attachments associated with the article.',
    type: [MediaAttachmentDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaAttachmentDto)
  mediaAttachments?: MediaAttachmentDto[];

  @ApiPropertyOptional({
    description: 'Tags associated with the article.',
    type: [ArticleTagDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleTagDto)
  tags?: ArticleTagDto[];

  @ApiPropertyOptional({
    description: 'Metadata associated with the article.',
    example: { key: 'value' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
