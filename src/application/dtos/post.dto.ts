// src/application/dtos/post.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Title of the post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Original content of the post' })
  @IsString()
  originalContent: string;

  @ApiProperty({ description: 'Content of the post' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Recommendation for the post' })
  @IsString()
  recommendation: string;

  @ApiProperty({ description: 'Explanation for the post' })
  @IsString()
  explanation: string;

  @ApiPropertyOptional({
    description: 'List of article IDs associated with the post',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  articlesId?: number[];

  @ApiPropertyOptional({ description: 'Scheduled date for the post' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledAt?: Date;
}

export class UpdatePostDto {
  @ApiPropertyOptional({ description: 'Title of the post' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Original content of the post' })
  @IsOptional()
  @IsString()
  originalContent?: string;

  @ApiPropertyOptional({ description: 'Content of the post' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Recommendation for the post' })
  @IsOptional()
  @IsString()
  recommendation?: string;

  @ApiPropertyOptional({ description: 'Explanation for the post' })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiPropertyOptional({
    description: 'List of article IDs associated with the post',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  articlesId?: number[];

  @ApiPropertyOptional({ description: 'Scheduled date for the post' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledAt?: Date;

  @ApiPropertyOptional({ description: 'Indicates if the post is published' })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
