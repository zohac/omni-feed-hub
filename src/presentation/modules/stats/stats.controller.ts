// src/presentation/stats/stats.controller.ts

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RssFeedStatsUseCases } from '../../../application/usecases/rss-feed.stats.use-cases';
import { RssFeedStats } from '../../../domain/entities/rss-feed.stats';

@Controller('stats')
export class StatsController {
  constructor(private readonly feedStatsUseCases: RssFeedStatsUseCases) {}

  @ApiOperation({ summary: 'Get all RSS feed stats' })
  @ApiResponse({
    status: 200,
    description: 'Returns all RSS feed stats',
    type: [RssFeedStats],
  })
  @Get()
  async getAllStats(): Promise<RssFeedStats[]> {
    return this.feedStatsUseCases.getAll();
  }
}
