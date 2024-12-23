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
  CreateRssFeedDto,
  UpdateRssFeedDto,
} from '../../../application/dtos/rss-feed.dto';
import { ParseFeedUseCases } from '../../../application/usecases/parse.feed.use-cases';
import { RssFeedUseCases } from '../../../application/usecases/rss-feed.use-cases';
import { RssFeed } from '../../../domain/entities/rss-feed';
import { ParsePositiveIntPipe } from '../../pipes/parse.positive.int.pipe';

@Controller('feeds')
export class RssFeedController {
  constructor(
    private readonly useCase: RssFeedUseCases,
    private readonly parseFeedUseCase: ParseFeedUseCases,
  ) {}

  @ApiOperation({ summary: 'Retrieve all RSS feeds' })
  @ApiResponse({
    status: 200,
    description: 'List of RSS feeds returned successfully.',
  })
  @Get()
  async getAllFeeds(): Promise<RssFeed[]> {
    return await this.useCase.getAll();
  }

  @ApiOperation({ summary: 'Get a single feed by its ID' })
  @ApiResponse({ status: 200, description: 'Feed found.' })
  @ApiResponse({ status: 404, description: 'Feed not found.' })
  @Get('/:id')
  async getFeedById(
    @Param('id', ParsePositiveIntPipe) id: number,
  ): Promise<RssFeed> {
    return await this.useCase.getOneById(id);
  }

  @ApiOperation({ summary: 'Create a new RSS feed' })
  @ApiResponse({ status: 201, description: 'Feed created successfully.' })
  @Post()
  async createFeed(@Body() dto: CreateRssFeedDto): Promise<RssFeed> {
    return await this.useCase.create(dto);
  }

  @ApiOperation({ summary: 'Update an existing RSS feed' })
  @ApiResponse({ status: 200, description: 'Feed updated successfully.' })
  @ApiResponse({ status: 404, description: 'Feed not found.' })
  @Put('/:id')
  async updateFeed(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateRssFeedDto,
  ): Promise<RssFeed> {
    return await this.useCase.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete an RSS feed' })
  @ApiResponse({ status: 204, description: 'Feed deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Feed not found.' })
  @Delete('/:id')
  @HttpCode(204)
  async deleteFeed(@Param('id', ParsePositiveIntPipe) id: number) {
    return await this.useCase.delete(id);
  }

  @Post('/parse/:id')
  async parseFeed(@Param('id', ParsePositiveIntPipe) id: number) {
    const feed = await this.useCase.getOneById(id);
    return await this.parseFeedUseCase.execute(feed);
  }
}
