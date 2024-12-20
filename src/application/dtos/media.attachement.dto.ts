// src/application/dtos/media-attachment.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class MediaAttachmentDto {
  @ApiProperty({
    description: 'The URL of the media attachment.',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  url!: string;

  @ApiPropertyOptional({
    description: 'The MIME type of the media attachment.',
    example: 'image/jpeg',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    description: 'The width of the media attachment in pixels.',
    example: 1024,
  })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({
    description: 'The height of the media attachment in pixels.',
    example: 768,
  })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({
    description: 'The size of the media attachment in bytes.',
    example: 204800,
  })
  @IsOptional()
  @IsNumber()
  length?: number;

  @ApiPropertyOptional({
    description: 'The title or caption of the media attachment.',
    example: 'Sample Image',
  })
  @IsOptional()
  @IsString()
  title?: string;
}
