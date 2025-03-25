import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ILogger } from '../../domain/interfaces/logger';
import { RssFeedStatsUseCases } from '../usecases/rss-feed.stats.use-cases';
import { RssFeedUseCases } from '../usecases/rss-feed.use-cases';

@Injectable()
export class RssFeedStatsScheduler {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    private readonly useCases: RssFeedStatsUseCases,
    private readonly rssFeedUseCase: RssFeedUseCases,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleTranscriptionSchedule() {
    this.logger.log('Sync Stats for all rss feed started...');
    const feeds = await this.rssFeedUseCase.getAll();
    await this.useCases.syncAllStats(feeds);
    this.logger.log('Sync Stats for all rss feed ended...');
  }
}
