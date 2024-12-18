// src/application/dtos/rss-feed.collection.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRssFeedCollectionDto {
  @ApiProperty({ description: 'Name of the RSS feed Collection' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Description of the RSS feed Collection' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;
}

export class UpdateRssFeedCollectionDto {
  @ApiProperty({ description: 'New name of the RSS feed Collection' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: 'New description of the RSS feed Collection' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;
}
