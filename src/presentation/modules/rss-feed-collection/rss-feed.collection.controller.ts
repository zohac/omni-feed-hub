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
  CreateRssFeedCollectionDto,
  UpdateRssFeedCollectionDto,
} from '../../../application/dtos/rss-feed.collection.dto';
import { RssFeedCollectionUseCases } from '../../../application/usecases/rss-feed.collection.use-cases';
import { RssFeedCollection } from '../../../domain/entities/rss-feed.collection';
import { ParsePositiveIntPipe } from '../../pipes/parse.positive.int.pipe';

@Controller('collections/feeds')
export class RssFeedCollectionController {
  constructor(private readonly useCase: RssFeedCollectionUseCases) {}

  @ApiOperation({ summary: 'Retrieve all RSS feeds collection' })
  @ApiResponse({
    status: 200,
    description: 'List of RSS feeds collection returned successfully.',
  })
  @Get()
  async getAllFeeds(): Promise<RssFeedCollection[]> {
    return await this.useCase.getAll();
  }

  @ApiOperation({ summary: 'Get a single RSS feed collection by its ID' })
  @ApiResponse({ status: 200, description: 'Feed collection found.' })
  @ApiResponse({ status: 404, description: 'Feed collection not found.' })
  @Get('/:id')
  async getFeedById(
    @Param('id', ParsePositiveIntPipe) id: number,
  ): Promise<RssFeedCollection> {
    return await this.useCase.getOneById(id);
  }

  @ApiOperation({ summary: 'Create a new RSS feed collection' })
  @ApiResponse({
    status: 201,
    description: 'Feed collection created successfully.',
  })
  @Post()
  async createFeed(
    @Body() dto: CreateRssFeedCollectionDto,
  ): Promise<RssFeedCollection> {
    return await this.useCase.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing RSS feed collection' })
  @ApiResponse({
    status: 200,
    description: 'Feed collection updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Feed collection not found.' })
  @Put('/:id')
  async updateFeed(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateRssFeedCollectionDto,
  ): Promise<RssFeedCollection> {
    return await this.useCase.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete an RSS feed collection' })
  @ApiResponse({
    status: 204,
    description: 'Feed collection deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Feed collection not found.' })
  @Delete('/:id')
  @HttpCode(204)
  async deleteFeed(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.useCase.delete(id);
  }
}
