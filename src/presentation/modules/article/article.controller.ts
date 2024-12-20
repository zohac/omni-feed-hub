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
  CreateArticleDto,
  UpdateArticleDto,
} from '../../../application/dtos/article.dto';
import { ArticleUseCases } from '../../../application/usecases/article.use-cases';
import { Article } from '../../../domain/entities/article';
import { ParsePositiveIntPipe } from '../../pipes/parse.positive.int.pipe';

@Controller('articles')
export class ArticleController {
  constructor(private readonly useCase: ArticleUseCases) {}

  @ApiOperation({ summary: 'Retrieve all articles' })
  @ApiResponse({
    status: 200,
    description: 'List of articles returned successfully.',
  })
  @Get()
  async getAllArticles(): Promise<Article[]> {
    return await this.useCase.getAll();
  }

  @ApiOperation({ summary: 'Get a single article by its ID' })
  @ApiResponse({ status: 200, description: 'Article found.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: The provided data is invalid.',
  })
  @Get('/:id')
  async getArticleById(
    @Param('id', ParsePositiveIntPipe) id: number,
  ): Promise<Article> {
    return await this.useCase.getOneById(id);
  }

  @ApiOperation({
    summary: 'Create a new article',
    description:
      'Creates a new article in the system. If an article with the same link already exists, the request will fail with a conflict error (HTTP 409).',
  })
  @ApiResponse({
    status: 201,
    description:
      'Article created successfully. Returns the created article object.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict: An article with the same link already exists. No new article is created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: The provided data is invalid.',
  })
  @Post()
  async createArticle(@Body() dto: CreateArticleDto): Promise<Article> {
    return await this.useCase.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing article' })
  @ApiResponse({ status: 200, description: 'Article updated successfully.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  @Put('/:id')
  async updateArticle(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateArticleDto,
  ): Promise<Article> {
    return await this.useCase.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete an article' })
  @ApiResponse({ status: 204, description: 'Article deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  @Delete('/:id')
  @HttpCode(204)
  async deleteArticle(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.useCase.delete(id);
  }
}
