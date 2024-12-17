// src/application/dtos/rss-feed.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateRssFeedDto {
  @ApiProperty({ description: 'Title of the RSS feed' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'URL of the RSS feed' })
  @IsUrl()
  url!: string;

  @ApiPropertyOptional({ description: 'Description of the feed' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;
}

export class UpdateRssFeedDto {
  @ApiPropertyOptional({ description: 'New title of the RSS feed' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'New URL of the RSS feed' })
  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ description: 'New description of the feed' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;
}
