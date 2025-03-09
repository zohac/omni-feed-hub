// src/presentation/stats/stats.module.ts

import { Module } from '@nestjs/common';

import { RssFeedStatsUseCases } from '../../../application/usecases/rss-feed.stats.use-cases';
import { InfrastructureModule } from '../../../infrastructure/modules/infrastructure.module';
import { RssFeedModule } from '../rss-feed/rss-feed.module';

import { StatsController } from './stats.controller';

@Module({
  imports: [InfrastructureModule, RssFeedModule],
  controllers: [StatsController],
  providers: [RssFeedStatsUseCases],
  exports: [RssFeedStatsUseCases],
})
export class StatsModule {}
