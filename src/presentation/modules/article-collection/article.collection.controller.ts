import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import {
  CreateArticleCollectionDto,
  UpdateArticleCollectionDto,
} from '../../../application/dtos/article.collection.dto';
import { ArticleCollectionUseCases } from '../../../application/usecases/article.collection.use-cases';
import { ArticleCollection } from '../../../domain/entities/article.collection';
import { ParsePositiveIntPipe } from '../../pipes/parse.positive.int.pipe';

@Controller('collections/articles')
export class ArticleCollectionController {
  constructor(private readonly useCase: ArticleCollectionUseCases) {}

  @ApiOperation({ summary: 'Retrieve all Articles collection' })
  @ApiResponse({
    status: 200,
    description: 'List of Articles collection returned successfully.',
  })
  @Get()
  async getAllArticleCollections(): Promise<ArticleCollection[]> {
    return await this.useCase.getAll();
  }

  @ApiOperation({ summary: 'Get a single Article collection by its ID' })
  @ApiResponse({ status: 200, description: 'Article collection found.' })
  @ApiResponse({ status: 404, description: 'Article collection not found.' })
  @Get('/:id')
  async getArticleCollectionById(
    @Param('id', ParsePositiveIntPipe) id: number,
  ): Promise<ArticleCollection> {
    return await this.useCase.getOneById(id);
  }

  @ApiOperation({ summary: 'Create a new RSS feed collection' })
  @ApiResponse({
    status: 201,
    description: 'Article collection created successfully.',
  })
  @Post()
  async createArticleCollection(
    @Body() dto: CreateArticleCollectionDto,
  ): Promise<ArticleCollection> {
    return await this.useCase.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing RSS feed collection' })
  @ApiResponse({
    status: 200,
    description: 'Article collection updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Article collection not found.' })
  @Put('/:id')
  async updateArticleCollection(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateArticleCollectionDto,
  ): Promise<ArticleCollection> {
    return await this.useCase.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete an RSS feed collection' })
  @ApiResponse({
    status: 204,
    description: 'Article collection deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Article collection not found.' })
  @Delete('/:id')
  @HttpCode(204)
  async deleteArticleCollection(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.useCase.delete(id);
  }
}
